import { type FC, useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { useTheme } from "@reillymc/react-native-components";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";

import { useColorScheme } from "@/hooks";

type FadeProps = {
    height: number;
    width: number;
    fadeOffset: number;
    direction: "up" | "down" | "left" | "right";
    flip?: boolean;
    color?: string;
    style?: StyleProp<ViewStyle>;
};

export const Fade: FC<FadeProps> = ({
    height,
    width,
    fadeOffset,
    direction,
    color,
    style,
}) => {
    const { theme } = useTheme();
    const scheme = useColorScheme();

    const gradientColor = color ?? theme.color.background;

    const start = useMemo(() => {
        switch (direction) {
            case "up":
                return vec(0, 0);
            case "down":
                return vec(0, height - fadeOffset);
            case "left":
                return vec(0, 0);
            case "right":
                return vec(width - fadeOffset, 0);
        }
    }, [direction, height, fadeOffset, width]);

    const end = useMemo(() => {
        switch (direction) {
            case "up":
                return vec(0, height - fadeOffset);
            case "down":
                return vec(0, 0);
            case "left":
                return vec(width - fadeOffset, 0);
            case "right":
                return vec(0, width - fadeOffset);
        }
    }, [direction, height, fadeOffset, width]);

    return (
        <Canvas style={[{ height, width }, style]}>
            <Rect x={0} y={0} width={width} height={height}>
                <LinearGradient
                    start={start}
                    end={end}
                    colors={[
                        scheme === "light"
                            ? `${gradientColor}00`
                            : "transparent",
                        gradientColor,
                    ]}
                />
            </Rect>
        </Canvas>
    );
};
