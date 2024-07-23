import type { FC, ReactElement } from "react";
import { type ScrollViewProps, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from "react-native-reanimated";

const HEADER_HEIGHT = 250;

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
                        [-HEADER_HEIGHT / 8, 0, HEADER_HEIGHT * 0.2],
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [1.5, 1, 1],
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
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: "hidden",
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: "hidden",
    },
});
