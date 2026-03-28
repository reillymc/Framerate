import type { FC, ReactElement } from "react";
import { type ScrollViewProps, StyleSheet, View } from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollOffset,
} from "react-native-reanimated";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

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
    const scrollOffset = useScrollOffset(scrollRef);
    const styles = useThemedStyles(createStyles, {});

    const headerAnimatedStyle = useAnimatedStyle(() => {
        const minScale = 1;
        const maxScale = 2;

        const translateY = interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [HEADER_HEIGHT * 0.5, 0, -HEADER_HEIGHT * 0.4],
            Extrapolation.CLAMP,
        );

        const scale = interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0],
            [maxScale, minScale],
            Extrapolation.CLAMP,
        );

        const opacity = interpolate(
            scrollOffset.value,
            [0, HEADER_HEIGHT / 3, HEADER_HEIGHT / 1.5],
            [1, 1, 0],
            Extrapolation.CLAMP,
        );

        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.header,
                    { height: HEADER_HEIGHT },
                    headerAnimatedStyle,
                ]}
            >
                {headerImage}
            </Animated.View>
            <Animated.ScrollView
                {...props}
                ref={scrollRef}
                scrollEventThrottle={16}
                contentContainerStyle={[contentContainerStyle]}
                style={styles.scroll}
            >
                {props.children}
            </Animated.ScrollView>
        </View>
    );
};

const createStyles = ({ theme: { color } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: color.background,
        },
        scroll: {
            flex: 1,
            paddingTop: 280,
        },
        header: {
            ...StyleSheet.absoluteFill,
            height: HEADER_HEIGHT,
            zIndex: 0,
            overflow: "hidden",
        },
        image: {
            width: "100%",
            height: "100%",
            resizeMode: "cover",
        },
    });
