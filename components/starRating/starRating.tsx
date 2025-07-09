import React, { type FC, useMemo, useRef, useState } from "react";
import {
    Animated,
    Easing,
    PanResponder,
    type StyleProp,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";
import { useTheme } from "@reillymc/react-native-components";

import { getStars } from "./helpers";
import { StarIcon } from "./starIcon";

type AnimationConfig = {
    easing?: (value: number) => number;
    duration?: number;
    delay?: number;
    scale?: number;
};

type StarRatingProps = {
    /**
     * Rating Value. Should be between 0 and `maxStars`.
     */
    rating: number;

    /**
     * Change listener that gets called when rating changes.
     */
    onChange: (rating: number) => void;

    /**
     * Custom color for the filled stars.
     *
     * @default '#fdd835'
     */
    color?: string;

    /**
     * Custom color for the empty stars.
     *
     * @default color
     */
    emptyColor?: string;

    /**
     * Total amount of stars to display.
     *
     * @default 5
     */
    maxStars?: number;

    /**
     * Size of the stars.
     *
     * @default 32
     */
    starSize?: number;

    /**
     * Enable half star ratings.
     *
     * @default true
     */
    enableHalfStar?: boolean;

    /**
     * Enable swiping to rate.
     *
     * @default true
     */
    enableSwiping?: boolean;

    /**
     * Callback that gets called when the interaction starts, before `onChange`.
     *
     * @param rating The rating value at the start of the interaction.
     */
    onRatingStart?: (rating: number) => void;

    /**
     * Callback that gets called when the interaction ends, after `onChange`.
     *
     * @param rating The rating value at the end of the interaction.
     */
    onRatingEnd?: (rating: number) => void;

    /**
     * Custom style for the component.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * Custom style for the star component.
     */
    starStyle?: StyleProp<ViewStyle>;

    /**
     * Custom animation configuration.
     *
     * @default
     * {
     *  easing: Easing.elastic(2),
     *  duration: 300,
     *  scale: 1.2,
     *  delay: 300
     * }
     */
    animationConfig?: AnimationConfig;
};

const defaultAnimationConfig: Required<AnimationConfig> = {
    easing: Easing.elastic(2),
    duration: 300,
    scale: 1.2,
    delay: 300,
};

export const StarRating: FC<StarRatingProps> = ({
    rating,
    maxStars = 5,
    starSize = 32,
    onChange,
    color,
    emptyColor = color,
    enableHalfStar = true,
    enableSwiping = true,
    onRatingStart,
    onRatingEnd,
    animationConfig = defaultAnimationConfig,
    style,
    starStyle,
}) => {
    const { theme } = useTheme();

    const width = useRef<number>(null);
    const [isInteracting, setInteracting] = useState(false);

    const panResponder = useMemo(() => {
        const calculateRating = (x: number) => {
            if (!width.current) return rating;

            const newRating = Math.max(
                0,
                Math.min(
                    Math.round((x / width.current) * maxStars * 2 + 0.2) / 2,
                    maxStars,
                ),
            );

            return enableHalfStar ? newRating : Math.ceil(newRating);
        };

        const handleChange = (newRating: number) => {
            if (newRating !== rating) {
                onChange(newRating);
            }
        };

        return PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderMove: (e) => {
                if (enableSwiping) {
                    const newRating = calculateRating(e.nativeEvent.locationX);
                    handleChange(newRating);
                }
            },
            onPanResponderStart: (e) => {
                const newRating = calculateRating(e.nativeEvent.locationX);
                onRatingStart?.(newRating);
                handleChange(newRating);
                setInteracting(true);
            },
            onPanResponderEnd: (e) => {
                const newRating = calculateRating(e.nativeEvent.locationX);
                handleChange(newRating);
                onRatingEnd?.(newRating);

                setTimeout(() => {
                    setInteracting(false);
                }, animationConfig.delay || defaultAnimationConfig.delay);
            },
            onPanResponderTerminate: () => {
                // called when user drags outside of the component
                setTimeout(() => {
                    setInteracting(false);
                }, animationConfig.delay || defaultAnimationConfig.delay);
            },
        });
    }, [
        rating,
        maxStars,
        enableHalfStar,
        onChange,
        enableSwiping,
        onRatingStart,
        onRatingEnd,
        animationConfig.delay,
    ]);

    return (
        <View style={style}>
            <View
                style={styles.starRating}
                {...panResponder.panHandlers}
                onLayout={(e) => {
                    width.current = e.nativeEvent.layout.width;
                }}
            >
                {getStars(rating, maxStars).map((starType, i) => {
                    return (
                        <AnimatedIcon
                            // biome-ignore lint/suspicious/noArrayIndexKey: only available key
                            key={i}
                            active={isInteracting && rating - i >= 0.5}
                            animationConfig={animationConfig}
                            style={starStyle}
                        >
                            <StarIcon
                                index={i}
                                type={starType}
                                size={starSize}
                                color={
                                    starType === "empty"
                                        ? (emptyColor ??
                                          theme.color.primaryLight)
                                        : (color ?? theme.color.primaryLight)
                                }
                            />
                        </AnimatedIcon>
                    );
                })}
            </View>
        </View>
    );
};

type AnimatedIconProps = {
    active: boolean;
    children: React.ReactElement;
    animationConfig: AnimationConfig;
    style?: StyleProp<ViewStyle>;
};

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    active,
    animationConfig,
    children,
    style,
}) => {
    const {
        scale = defaultAnimationConfig.scale,
        easing = defaultAnimationConfig.easing,
        duration = defaultAnimationConfig.duration,
    } = animationConfig;

    const animatedSize = React.useRef(new Animated.Value(active ? scale : 1));

    React.useEffect(() => {
        const animation = Animated.timing(animatedSize.current, {
            toValue: active ? scale : 1,
            useNativeDriver: true,
            easing,
            duration,
        });

        animation.start();
        return animation.stop;
    }, [active, scale, easing, duration]);

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.star,
                style,
                {
                    transform: [
                        {
                            scale: animatedSize.current,
                        },
                    ],
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    starRating: {
        flexDirection: "row",
        alignSelf: "flex-start",
    },
    star: {
        marginHorizontal: 5,
    },
});
