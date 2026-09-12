module.exports = {
  testEnvironment: 'node',
  // 只跑活跃测试；第一代流水线的测试已归档到 archive/first-gen/tests/，
  // 需要时用 `npx jest --config archive/first-gen/jest.config.js` 单独运行。
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/archive/'],
  collectCoverageFrom: [
    '*.js',
    'engine/**/*.js',
    'tools/**/*.js',
    '!node_modules/**',
    '!coverage/**',
    '!output/**',
    '!logs/**',
    '!archive/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000,
  setupFilesAfterEnv: [],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
};
