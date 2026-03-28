import { Platform } from "react-native";

export const NAVIGATION_BAR_HEIGHT = 80;

export const WebPageLayout =
    Platform.OS === "web"
        ? ({
              paddingTop: 100,
              width: 400,
              alignSelf: "center",
              paddingBottom: 100,
              maxWidth: "90%",
          } as const)
        : {};

export const WebPageModal =
    Platform.OS === "web"
        ? ({
              position: "absolute",
              top: 140,
              width: 480,
              alignSelf: "center",
              maxWidth: "90%",
              maxHeight: "40%",
              minHeight: "40%",
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 32,
              backgroundColor: "#fff",
              borderRadius: 8,
          } as const)
        : {};
