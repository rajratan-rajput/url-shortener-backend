/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/tests/**/*.integration.test.js"],
  verbose: true,
  // First run may download the MongoDB binary for mongodb-memory-server
  testTimeout: 120000,
};
