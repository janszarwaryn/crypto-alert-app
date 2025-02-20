import '@testing-library/jest-dom';

// Mock WebSocket
global.WebSocket = require('jest-websocket-mock');

// Mock environment variables
process.env.REACT_APP_CRYPTO_API_KEY = 'test-api-key';

// Setup custom matchers
expect.extend({
  toBeWithinLastMinute(received) {
    const pass = new Date().getTime() - received.getTime() <= 60 * 1000;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within last minute`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within last minute`,
        pass: false,
      };
    }
  },
});
