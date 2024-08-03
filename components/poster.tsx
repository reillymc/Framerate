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
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { TmdbImage } from "./tmdbImage";

export interface PosterProps {
    imageUri?: string;
    heading?: string;
    /**
     * Supports:
     * - `<PosterRow/>`
     * - `<PosterRow/>[]`
     */
    contentRows?: Array<React.ReactNode>;

    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const Poster: React.FC<PosterProps> = ({
    heading,
    contentRows = [],
    style,
    imageUri,
    onPress,
}) => {
    const filteredRows = contentRows.filter(Undefined);

    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const itemWidth = (width - theme.padding.pageHorizontal * 2) * (2 / 3);

    const styles = useThemedStyles(createStyles, { itemWidth });
    return (
        <Pressable onPress={onPress} style={[styles.pressableContainer, style]}>
            <TmdbImage
                path={imageUri}
                type="poster"
                style={{
                    height: itemWidth * (3 / 2),
                    width: itemWidth,
                    borderRadius: styles.pressableContainer.borderRadius,
                }}
            />
            <View>
                <View style={styles.contentDecorator} />
                <View style={styles.contentContainer}>
                    {!!heading && (
                        <Text variant="heading" numberOfLines={2}>
                            {heading}
                        </Text>
                    )}
                    {filteredRows}
                </View>
            </View>
        </Pressable>
    );
};

Poster.displayName = "Poster";

const createStyles = (
    { styles: { listItem }, theme: { padding, color } }: ThemedStyles,
    { itemWidth }: { itemWidth: number },
) => {
    const styles = StyleSheet.create({
        pressableContainer: {
            marginBottom: listItem.spacingMargin,
            width: itemWidth,
            marginRight: padding.pageHorizontal / 2,
            borderRadius: listItem.borderRadius,
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
    return styles;
};

export interface PosterRowProps {
    contentItems?: Array<React.ReactNode> | React.ReactNode;
}

export const PosterRow: React.FC<PosterRowProps> = ({ contentItems }) => {
    const styles = useThemedStyles(createStyles, {});

    const items = Array.isArray(contentItems) ? contentItems : [contentItems];
    return (
        <View style={styles.contentItem}>
            {items.map((item, index) => (
                <View key={index.toString()} style={styles.contentItem}>
                    {item}
                </View>
            ))}
        </View>
    );
};
