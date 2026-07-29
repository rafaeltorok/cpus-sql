const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: process.env.CYPRESS_BASEURL || "http://localhost:5173",
    env: {
      backendUrl: process.env.CYPRESS_BACKEND_BASEURL
        ? process.env.CYPRESS_BACKEND_BASEURL
        : "http://localhost:3001",
    },
  },
});
