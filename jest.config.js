module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/**/*.integration.test.js'
  ],
  collectCoverageFrom: [
    'modules/**/*.js',
    '!modules/**/*.model.js',
    '!modules/**/*.routes.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/'
  ],
  testTimeout: 10000,
  verbose: true,
  forceExit: true
};
