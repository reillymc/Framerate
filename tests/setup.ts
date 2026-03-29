import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

require("react-native-reanimated").setUpTests();

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

jest.mock("react-native-worklets", () =>
    require("react-native-worklets/src/mock"),
);

jest.mock("expo-font", () => ({}));
