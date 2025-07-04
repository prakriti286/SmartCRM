module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.m?[jt]s$': 'babel-jest' // handles .js and .mjs both
  },

 transformIgnorePatterns: [
    '/node_modules/(?!(axios|vee-validate|@vee-validate|vue|vuex|vue-router|@vue/test-utils)/)'
  ],

  moduleFileExtensions: ['js', 'json', 'vue'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp|avif|ico|bmp)$': '<rootDir>/__mocks__/fileMock.js'
  },

  testMatch: [
    '**/src/tests/**/*.test.js',
    '**/tests/unit/**/*.spec.js',
    '**/__tests__/**/*.js',
    '**/src/components/**/*.spec.js'
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}
