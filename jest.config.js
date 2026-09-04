module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jest-environment-jsdom',
  collectCoverage: true,
  // Sans cette liste, seuls les fichiers atteints par un test entrent dans le
  // calcul : la couverture affichee serait optimiste. Les modeles (interfaces
  // TypeScript) et le bootstrap sont exclus car ils ne portent aucune logique.
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/models/**',
    '!src/app/app.config.ts',
    '!src/app/app.routes.ts',
  ],
  coverageReporters: ['html', 'lcov', 'text-summary', 'json-summary'],
  coverageDirectory: 'coverage/pmt-frontend',
  // Seuil impose par l'enonce : 60 % des instructions ET des branches.
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
    },
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
