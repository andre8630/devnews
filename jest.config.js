const nextJest = require("next/jest");

const createJestConfig = nextJest();

const jestConfig = createJestConfig({
  testEnvironment: "node",
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>"],
});

module.exports = jestConfig;
