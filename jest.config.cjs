module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: ['TS151002'], // 忽略 hybrid module kind 警告
        },
      },
    ],
  },
  collectCoverageFrom: [
    'packages/**/src/**/*.ts',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/*.test.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  moduleNameMapper: {
    '^@parseflow/core$': '<rootDir>/packages/pdf-parser-core/src/index.ts',
    '^@parseflow/mcp-server$': '<rootDir>/packages/mcp-server/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1', // 将 .js 导入映射回 .ts 文件
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
