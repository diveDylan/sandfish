module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '\\.hbs$': '<rootDir>/src/templates/.mock/index.js',
  },
  testPathIgnorePatterns: ['<rootDir>/dist'],
  coveragePathIgnorePatterns: ['<rootDir>/dist', 'tests'],
};
