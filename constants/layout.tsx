import { Platform } from "react-native";

export const NAVIGATION_BAR_HEIGHT = 80;

export const WebPageLayout =
    Platform.OS === "web"
        ? ({
              paddingTop: 100,
              width: 400,
              alignSelf: "center",
              paddingBottom: "10%",
          } as const)
        : {};
