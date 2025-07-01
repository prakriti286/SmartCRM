module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {}, 

  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest'
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(vue|vuex|vue-router|@vue/test-utils)/)'
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
    '**/__tests__/**/*.js'
  ],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'] 
}
