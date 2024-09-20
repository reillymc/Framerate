import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type FadeProps = {
    height: number;
    width: number;
    fadeOffset: number;
    direction: "vertical" | "horizontal";
    style?: StyleProp<ViewStyle>;
};

export const Fade: FC<FadeProps> = () => null;
