const { 
  AppError, 
  ErrorTypes, 
  createAppError, 
  withRetry, 
  withBatch,
  calculateDelay,
  CircuitBreaker 
} = require('../errors');

describe('Error Module', () => {
  describe('AppError', () => {
    test('should create error with correct type', () => {
      const error = new AppError('Test error', ErrorTypes.NETWORK);
      expect(error.message).toBe('Test error');
      expect(error.type).toBe(ErrorTypes.NETWORK);
      expect(error.isRecoverable).toBe(true);
    });

    test('should mark auth errors as non-recoverable', () => {
      const error = new AppError('Auth failed', ErrorTypes.AUTH);
      expect(error.isRecoverable).toBe(false);
    });

    test('should track retry count', () => {
      const error = new AppError('Test', ErrorTypes.NETWORK, { retryCount: 2 });
      expect(error.retryCount).toBe(2);
    });
  });

  describe('createAppError', () => {
    test('should convert Error to AppError', () => {
      const original = new Error('Original error');
      const appError = createAppError(original);
      expect(appError).toBeInstanceOf(AppError);
      expect(appError.message).toBe('Original error');
    });

    test('should preserve existing AppError', () => {
      const original = new AppError('Original', ErrorTypes.NETWORK);
      const appError = createAppError(original);
      expect(appError.message).toBe('Original');
      expect(appError.type).toBe(ErrorTypes.NETWORK);
    });
  });

  describe('calculateDelay', () => {
    test('should calculate exponential backoff', () => {
      const delay0 = calculateDelay(0, { initialDelay: 1000, backoffFactor: 2, jitter: false });
      const delay1 = calculateDelay(1, { initialDelay: 1000, backoffFactor: 2, jitter: false });
      const delay2 = calculateDelay(2, { initialDelay: 1000, backoffFactor: 2, jitter: false });

      expect(delay0).toBe(1000);
      expect(delay1).toBe(2000);
      expect(delay2).toBe(4000);
    });

    test('should respect maxDelay', () => {
      const delay = calculateDelay(10, { initialDelay: 1000, maxDelay: 30000, backoffFactor: 2, jitter: false });
      expect(delay).toBe(30000);
    });
  });

  describe('withRetry', () => {
    test('should succeed on first try', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const result = await withRetry(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test('should retry on failure', async () => {
      const fn = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      
      const result = await withRetry(fn, { maxRetries: 3, initialDelay: 10 });
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test('should throw after max retries', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      
      await expect(
        withRetry(fn, { maxRetries: 2, initialDelay: 10 })
      ).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe('withBatch', () => {
    test('should process items with concurrency', async () => {
      const items = [1, 2, 3, 4, 5];
      const fn = jest.fn().mockImplementation(async (item) => item * 2);
      
      const { results, success } = await withBatch(items, fn, { concurrency: 2 });
      
      expect(success).toBe(5);
      expect(results.filter(r => r.status === 'fulfilled').length).toBe(5);
    });

    test('should continue on error when configured', async () => {
      const items = [1, 2, 3];
      const fn = jest.fn().mockImplementation(async (item) => {
        if (item === 2) throw new Error('fail');
        return item;
      });
      
      const { results, success, errors } = await withBatch(items, fn, { 
        concurrency: 1, 
        continueOnError: true 
      });
      
      expect(success).toBe(2);
      expect(errors.length).toBe(1);
    });
  });

  describe('CircuitBreaker', () => {
    test('should start in closed state', () => {
      const cb = new CircuitBreaker({ failureThreshold: 3 });
      expect(cb.getStatus().state).toBe('CLOSED');
    });

    test('should open after threshold failures', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, timeout: 1000 });
      
      const fn = jest.fn().mockRejectedValue(new Error('fail'));
      
      await expect(cb.execute(fn)).rejects.toThrow();
      await expect(cb.execute(fn)).rejects.toThrow();
      
      expect(cb.getStatus().state).toBe('OPEN');
    });

    test('should allow execution when half-open', async () => {
      const cb = new CircuitBreaker({ 
        failureThreshold: 1, 
        successThreshold: 1,
        timeout: 50 
      });
      
      // Fail to open
      await expect(cb.execute(() => Promise.reject(new Error('fail')))).rejects.toThrow();
      expect(cb.getStatus().state).toBe('OPEN');
      
      // Wait for timeout
      await new Promise(r => setTimeout(r, 60));
      
      // Should be half-open
      expect(cb.getStatus().state).toBe('HALF_OPEN');
    });
  });
});
