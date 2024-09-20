import { useColorScheme } from "@/hooks";
import { useTheme } from "@reillymc/react-native-components";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";

type FadeProps = {
    height: number;
    width: number;
    fadeOffset: number;
    direction: "vertical" | "horizontal";
    style?: StyleProp<ViewStyle>;
};

export const Fade: FC<FadeProps> = ({
    height,
    width,
    fadeOffset,
    direction,
    style,
}) => {
    const { theme } = useTheme();
    const scheme = useColorScheme();

    return (
        <Canvas style={[{ height, width }, style]}>
            <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                    start={direction === "vertical" ? vec(0, 0) : vec(width, 0)}
                    end={
                        direction === "vertical"
                            ? vec(fadeOffset, 0)
                            : vec(width, fadeOffset)
                    }
                    colors={[
                        scheme === "light"
                            ? `${theme.color.background}00`
                            : "transparent",
                        theme.color.background,
                    ]}
                />
            </Rect>
        </Canvas>
    );
};
