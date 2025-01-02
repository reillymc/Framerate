import { type FC, type ReactNode, useEffect } from "react";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export type AccordionProps = {
    collapsed: boolean;
    children: ReactNode;
    style: StyleProp<ViewStyle>;
};

export const Accordion: FC<AccordionProps> = ({
    collapsed,
    children,
    style,
}) => {
    const height = useSharedValue(0);

    const derivedHeight = useDerivedValue(() =>
        withTiming(height.value * Number(collapsed), {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            reduceMotion: ReduceMotion.System,
        }),
    );
    const bodyStyle = useAnimatedStyle(() => ({
        height: derivedHeight.value,
    }));
    useEffect(() => {
        console.log(collapsed);
    }, [collapsed]);

    return (
        <Animated.View style={[bodyStyle, styles.animatedView, style]}>
            <View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                }}
                style={styles.wrapper}
            >
                {children}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        display: "flex",
        width: "100%",
    },
    animatedView: {
        overflow: "hidden",
        flex: 1,
    },
    box: {
        height: 120,
        width: 120,
        color: "#f8f9ff",
        backgroundColor: "#b58df1",
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
});
