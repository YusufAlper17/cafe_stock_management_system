// Test setup file
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_STORAGE = './database.test.sqlite';

// Clean up test database before tests
const testDbPath = path.join(__dirname, '..', 'database.test.sqlite');
const testDbJournalPath = testDbPath + '-journal';
const testDbWalPath = testDbPath + '-wal';
const testDbShmPath = testDbPath + '-shm';

[testDbPath, testDbJournalPath, testDbWalPath, testDbShmPath].forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
    } catch (err) {
      // Ignore errors
    }
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
