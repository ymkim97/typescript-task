/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  verbose: true,
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  setupFiles: ['./test/setup-test.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '@config/(.*)$': '<rootDir>/src/core/config/$1',
    '@util/(.*)$': '<rootDir>/src/core/util/$1',
    '@controller/(.*)$': '<rootDir>/src/api/presentation/controller/$1',
    '@route/(.*)$': '<rootDir>/src/api/presentation/route/$1',
    '@repository/(.*)$': '<rootDir>/src/api/repository/$1',
    '@service/(.*)$': '<rootDir>/src/api/application/service/$1',
    '@loader/(.*)$': '<rootDir>/src/core/loader/$1',
    '@entity/(.*)$': '<rootDir>/src/api/dto/entity/$1',
    '@error/(.*)$': '<rootDir>/src/core/error/$1',
    '@dto/(.*)$': '<rootDir>/src/api/dto/$1',
    '@constant/(.*)$': '<rootDir>/src/core/constant/$1',
    '@decorator/(.*)$':
      '<rootDir>/src/api/presentation/validation/decorator/$1',
    '@test/(.*)$': '<rootDir>/test/$1',
  },
};
