const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    testIsolation: true,
  },
});
