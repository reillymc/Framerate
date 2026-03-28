import type { FC, PropsWithChildren } from "react";
import {
    Pressable,
    type StyleProp,
    StyleSheet,
    View,
    type ViewStyle,
} from "react-native";
import { Link } from "expo-router";
import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { type PosterSize, usePosterDimensions } from "@/hooks";

import { TmdbImage } from "./tmdbImage";

export interface PosterProps {
    imageUri?: string;
    heading?: string;
    subHeading?: string;
    removeMargin?: boolean;
    teaseSpacing?: boolean;
    style?: StyleProp<ViewStyle>;
    size?: PosterSize;
    asLink?: boolean;
    onPress?: () => void;
}

export const Poster: FC<PosterProps> = ({
    heading,
    subHeading,
    style,
    imageUri,
    removeMargin = false,
    teaseSpacing = false,
    size = "large",
    asLink,
    onPress,
}) => {
    const { height, width, gap } = usePosterDimensions({ size, teaseSpacing });

    const styles = useThemedStyles(createStyles, {
        width,
        size,
        gap,
        removeMargin,
    });
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            style={({ pressed }) => [
                styles.pressableContainer,
                style,
                pressed && { backgroundColor: theme.color.background },
            ]}
        >
            {({ pressed }) => (
                <>
                    <Wrapper asLink={asLink}>
                        <TmdbImage
                            path={imageUri}
                            type="poster"
                            style={{
                                height,
                                width,
                                borderRadius:
                                    styles.pressableContainer.borderRadius,
                                opacity: pressed ? 0.85 : 1,
                            }}
                        />
                    </Wrapper>
                    {!!heading && (
                        <View>
                            <View
                                style={[
                                    styles.contentDecorator,
                                    pressed && { opacity: 0.5 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.contentContainer,
                                    pressed && { opacity: 0.5 },
                                ]}
                            >
                                <Text
                                    variant={
                                        size === "large" ? "heading" : "label"
                                    }
                                    numberOfLines={2}
                                >
                                    {heading}
                                </Text>
                            </View>
                        </View>
                    )}
                    {!!subHeading && (
                        <View>
                            <View
                                style={[
                                    styles.contentDecorator,
                                    { opacity: 0 },
                                ]}
                            />
                            <View
                                style={[
                                    styles.contentContainer,
                                    pressed && { opacity: 0.5 },
                                ]}
                            >
                                <Text variant="caption" numberOfLines={2}>
                                    {subHeading}
                                </Text>
                            </View>
                        </View>
                    )}
                </>
            )}
        </Pressable>
    );
};

const Wrapper: FC<PropsWithChildren<{ asLink?: boolean }>> = ({
    asLink,
    children,
}) => (asLink ? <Link.AppleZoom>{children}</Link.AppleZoom> : children);

const createStyles = (
    { styles: { listItem }, theme: { spacing, color, border } }: ThemedStyles,
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
            marginBottom: removeMargin ? undefined : listItem.spacingMargin,
            width,
            marginRight: removeMargin ? undefined : gap,
            borderRadius: ["small", "tiny"].includes(size)
                ? border.radius.regular
                : border.radius.loose,
        },
        contentContainer: {
            paddingTop: spacing.small,
            paddingLeft: spacing.medium,
            paddingRight: spacing.small,
        },
        contentDecorator: {
            backgroundColor: color.foreground,
            width: 4,
            borderRadius: 4,
            position: "absolute",
            top: 6,
            bottom: 0,
        },
        contentItem: {
            flexDirection: "row",
        },
        contextMenu: {
            borderRadius: ["small", "tiny"].includes(size)
                ? border.radius.regular
                : border.radius.loose,
        },
    });
