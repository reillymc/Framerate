/** @type {import('jest').Config} */
const config = {
    preset: "jest-expo",
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/services/framerateBackend/**",
        "!dist/**",
        "!/node_modules/**",
    ],

    coverageThreshold: {
        global: {
            branches: 1,
            functions: 0.5,
            lines: 1,
        },
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@reillymc/.*)",
    ],
    moduleNameMapper: {
        "^@reillymc/react-native-components$":
            "<rootDir>/node_modules/@reillymc/react-native-components/lib/index.js",
    },
};

module.exports = config;
