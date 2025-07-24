// functions/jest.config.js
module.exports = {
    testEnvironment: 'node',
    verbose: true,
    // Cari file test di semua subdirektori dengan akhiran .test.js atau .spec.js
    testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
    // Abaikan folder node_modules dan public saat testing
    modulePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/public'],
  };