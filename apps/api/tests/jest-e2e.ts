import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';
// eslint-disable-next-line
// @ts-ignore
import { compilerOptions } from '../tsconfig';

const config: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '..',
  maxWorkers: '50%',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/tests/setup-tests.ts'],
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '^~/tests-fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
  },
};

export default config;
