module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    '^mocks/(.*)$': '<rootDir>/mocks/$1',
  }
};
