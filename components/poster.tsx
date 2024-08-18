import type React from "react";
import {
    Pressable,
    type StyleProp,
    StyleSheet,
    View,
    type ViewStyle,
    useWindowDimensions,
} from "react-native";

import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useMemo } from "react";
import { TmdbImage } from "./tmdbImage";

interface PosterProps {
    imageUri?: string;
    heading?: string;
    removeMargin?: boolean;
    style?: StyleProp<ViewStyle>;
    size?: "small" | "medium" | "large";
    onPress?: () => void;
}

export const Poster: React.FC<PosterProps> = ({
    heading,
    style,
    imageUri,
    removeMargin = false,
    size = "large",
    onPress,
}) => {
    const { height, width, gap } = usePosterDimensions({ size });

    const styles = useThemedStyles(createStyles, {
        width,
        size,
        gap,
        removeMargin,
    });
    return (
        <Pressable onPress={onPress} style={[styles.pressableContainer, style]}>
            <TmdbImage
                path={imageUri}
                type="poster"
                style={{
                    height,
                    width,
                    borderRadius: styles.pressableContainer.borderRadius,
                }}
            />
            {!!heading && (
                <View>
                    <View style={styles.contentDecorator} />
                    <View style={styles.contentContainer}>
                        <Text
                            variant={size === "large" ? "heading" : "label"}
                            numberOfLines={2}
                        >
                            {heading}
                        </Text>
                    </View>
                </View>
            )}
        </Pressable>
    );
};

type UsePosterDimensionsParams = (
    params: Pick<Required<PosterProps>, "size">,
) => { width: number; height: number; gap: number };

export const usePosterDimensions: UsePosterDimensionsParams = ({ size }) => {
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const itemWidth = useMemo(() => {
        switch (size) {
            case "large":
                return (width - theme.padding.pageHorizontal * 2) * (2 / 3);
            case "medium":
                return (
                    (width -
                        theme.padding.pageHorizontal * 2 -
                        theme.padding.pageHorizontal / 2) *
                    (1 / 2)
                );
            case "small":
                return (width - theme.padding.pageHorizontal * 3) * (1 / 3);
        }
    }, [size, width, theme.padding.pageHorizontal]);

    return {
        width: itemWidth,
        height: itemWidth * (3 / 2),
        gap: theme.padding.pageHorizontal / 2,
    };
};

const createStyles = (
    { styles: { listItem }, theme: { padding, color, border } }: ThemedStyles,
    {
        width,
        size,
        removeMargin,
        gap,
    }: { width: number; gap: number } & Pick<
        Required<PosterProps>,
        "size" | "removeMargin"
    >,
) =>
    StyleSheet.create({
        pressableContainer: {
            marginBottom: listItem.spacingMargin,
            width,
            marginRight: removeMargin ? undefined : gap,
            borderRadius:
                size === "small" ? border.radius.regular : border.radius.loose,
        },
        contentContainer: {
            paddingVertical: padding.small,
            paddingLeft: padding.regular,
            paddingRight: padding.small,
        },
        contentDecorator: {
            backgroundColor: color.white,
            width: 4,
            borderRadius: 5,
            position: "absolute",
            top: 6,
            bottom: 6,
        },
        contentItem: {
            flexDirection: "row",
        },
    });
