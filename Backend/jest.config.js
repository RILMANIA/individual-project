module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "controllers/**/*.js",
    "helpers/**/*.js",
    "middlewares/**/*.js",
    "models/**/*.js",
    "app.js",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/migrations/",
    "/seeders/",
    "/extractData/",
    "/data/",
    "models/index.js",
  ],
  testMatch: ["**/__test__/**/*.test.js"],
  verbose: true,
};
