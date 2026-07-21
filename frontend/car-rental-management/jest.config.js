export default {
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".jsx"],

  transform: {
    "^.+\\.[jt]sx?$": [
      "@swc/jest",
      {
        jsc: {
          parser: {
            syntax: "ecmascript",
            jsx: true,
          },
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },

        module: {
          type: "es6",
        },
      },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
};