const Scheduler = require('../scheduler');

describe('Scheduler', () => {
  let scheduler;
  let mockTask;

  beforeEach(() => {
    scheduler = new Scheduler();
    mockTask = jest.fn().mockResolvedValue('task completed');
  });

  afterEach(() => {
    scheduler.stopAll();
  });

  describe('schedule jobs', () => {
    test('should schedule interval job', () => {
      scheduler.scheduleInterval('testJob', mockTask, 100);
      expect(scheduler.jobs.size).toBe(1);
    });

    test('should schedule cron job', () => {
      scheduler.scheduleCron('cronJob', mockTask, '* * * * *');
      expect(scheduler.jobs.size).toBe(1);
    });

    test('should schedule once', () => {
      scheduler.scheduleOnce('onceJob', mockTask, 100);
      expect(scheduler.jobs.size).toBe(1);
    });
  });

  describe('job execution', () => {
    test('should execute interval job', async () => {
      scheduler.scheduleInterval('testJob', mockTask, 50);
      await new Promise(r => setTimeout(r, 120));
      
      expect(mockTask).toHaveBeenCalled();
    });

    test('should stop job', () => {
      scheduler.scheduleInterval('testJob', mockTask, 50);
      scheduler.stopJob('testJob');
      
      expect(scheduler.getJobStatus('testJob')).toBe('stopped');
    });
  });

  describe('job management', () => {
    test('should get job status', () => {
      scheduler.scheduleInterval('testJob', mockTask, 100);
      
      const status = scheduler.getJobStatus('testJob');
      expect(status).toBeDefined();
      expect(status.name).toBe('testJob');
    });

    test('should return null for unknown job', () => {
      expect(scheduler.getJobStatus('unknown')).toBeNull();
    });

    test('should get all job statuses', () => {
      scheduler.scheduleInterval('job1', mockTask, 100);
      scheduler.scheduleInterval('job2', mockTask, 100);
      
      const statuses = scheduler.getAllJobStatuses();
      expect(statuses.length).toBe(2);
    });

    test('should pause and resume job', () => {
      scheduler.scheduleInterval('testJob', mockTask, 50);
      
      scheduler.pauseJob('testJob');
      expect(scheduler.getJobStatus('testJob')).toBe('paused');
      
      scheduler.resumeJob('testJob');
      expect(scheduler.getJobStatus('testJob')).toBe('running');
    });
  });

  describe('statistics', () => {
    test('should track execution count', async () => {
      scheduler.scheduleInterval('testJob', mockTask, 30);
      await new Promise(r => setTimeout(r, 100));
      
      const status = scheduler.getJobStatus('testJob');
      expect(status.executionCount).toBeGreaterThan(0);
    });

    test('should track last execution time', async () => {
      scheduler.scheduleInterval('testJob', mockTask, 50);
      await new Promise(r => setTimeout(r, 100));
      
      const status = scheduler.getJobStatus('testJob');
      expect(status.lastExecution).toBeDefined();
    });
  });

  describe('error handling', () => {
    test('should handle task errors', async () => {
      const errorTask = jest.fn().mockRejectedValue(new Error('Task failed'));
      scheduler.scheduleInterval('errorJob', errorTask, 50);
      
      await new Promise(r => setTimeout(r, 100));
      
      const status = scheduler.getJobStatus('errorJob');
      expect(status.lastError).toBeDefined();
    });
  });

  describe('lifecycle', () => {
    test('should start all jobs', () => {
      scheduler.scheduleInterval('job1', mockTask, 100);
      scheduler.scheduleInterval('job2', mockTask, 100);
      
      scheduler.startAll();
      
      const statuses = scheduler.getAllJobStatuses();
      statuses.forEach(s => expect(s.status).toBe('running'));
    });

    test('should stop all jobs', () => {
      scheduler.scheduleInterval('job1', mockTask, 100);
      scheduler.scheduleInterval('job2', mockTask, 100);
      
      scheduler.stopAll();
      
      const statuses = scheduler.getAllJobStatuses();
      expect(statuses.length).toBe(0);
    });
  });
});
