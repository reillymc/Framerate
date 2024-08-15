import type { FC, ReactElement } from "react";
import { type ScrollViewProps, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated";

const HEADER_HEIGHT = 300;

type Props = {
    headerImage: ReactElement;
} & ScrollViewProps;

export const ParallaxScrollView: FC<Props> = ({
    headerImage,
    contentContainerStyle,
    ...props
}: Props) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 8 + 80, 0, HEADER_HEIGHT * 0.2],
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT / 2 + 80],
                        [1.4, 1.1, 1],
                    ),
                },
            ],
        };
    });

    return (
        <Animated.ScrollView
            ref={scrollRef}
            scrollEventThrottle={16}
            {...props}
        >
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
                {headerImage}
            </Animated.View>
            <View style={contentContainerStyle}>{props.children}</View>
        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 300,
        overflow: "hidden",
    },
});
