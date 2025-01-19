import {
    Platform,
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
import { type FC, useMemo } from "react";
import { ContextMenu, type MenuElementConfig } from "./contextMenu";
import { TmdbImage } from "./tmdbImage";

export interface PosterProps {
    imageUri?: string;
    heading?: string;
    subHeading?: string;
    removeMargin?: boolean;
    style?: StyleProp<ViewStyle>;
    size?: "tiny" | "small" | "medium" | "large";
    onWatchlist?: boolean;
    onPress?: () => void;
    onToggleWatchlist?: () => void;
    onAddReview?: () => void;
    onOpenReview?: () => void;
}

export const Poster: FC<PosterProps> = ({
    heading,
    subHeading,
    style,
    imageUri,
    removeMargin = false,
    size = "large",
    onWatchlist,
    onPress,
    onAddReview,
    onOpenReview,
    onToggleWatchlist,
}) => {
    const { height, width, gap } = usePosterDimensions({ size });

    const styles = useThemedStyles(createStyles, {
        width,
        size,
        gap,
        removeMargin,
    });
    const { theme } = useTheme();

    const watchlistAction: MenuElementConfig | undefined = useMemo(() => {
        if (!onToggleWatchlist) return undefined;
        return onWatchlist
            ? {
                  actionKey: "watchlist-remove",
                  actionTitle: "Remove from Watchlist",
                  icon: {
                      type: "IMAGE_SYSTEM",
                      imageValue: {
                          systemName: "eye.slash",
                      },
                  },
              }
            : {
                  actionKey: "watchlist-add",
                  actionTitle: "Add to Watchlist",
                  icon: {
                      type: "IMAGE_SYSTEM",
                      imageValue: {
                          systemName: "eye",
                      },
                  },
              };
    }, [onWatchlist, onToggleWatchlist]);

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
                    <ContextMenu
                        interaction="long-press"
                        menuConfig={{
                            menuTitle: "",
                            menuItems: [
                                onAddReview
                                    ? ({
                                          actionKey: "add-review",
                                          actionTitle: "Add Watch",
                                          icon: {
                                              type: "IMAGE_SYSTEM",
                                              imageValue: {
                                                  systemName: "plus",
                                              },
                                          },
                                      } satisfies MenuElementConfig)
                                    : undefined,
                                onOpenReview
                                    ? ({
                                          actionKey: "open-review",
                                          actionTitle: "Open Watch",
                                          icon: {
                                              type: "IMAGE_SYSTEM",
                                              imageValue: {
                                                  systemName: "book.fill",
                                              },
                                          },
                                      } satisfies MenuElementConfig)
                                    : undefined,
                                watchlistAction,
                            ].filter(Undefined),
                        }}
                        onPressMenuAction={({ actionKey }) => {
                            switch (actionKey) {
                                case "view":
                                    onPress?.();
                                    break;
                                case "add-review":
                                    onAddReview?.();
                                    break;
                                case "open-review":
                                    onOpenReview?.();
                                    break;
                                case "watchlist-add":
                                    onToggleWatchlist?.();
                                    break;
                                case "watchlist-remove":
                                    onToggleWatchlist?.();
                                    break;
                            }
                        }}
                        style={styles.contextMenu}
                    >
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
                    </ContextMenu>
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

type UsePosterDimensionsParams = (
    params: Pick<Required<PosterProps>, "size">,
) => { width: number; height: number; gap: number };

export const usePosterDimensions: UsePosterDimensionsParams = ({ size }) => {
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const itemWidth = useMemo(() => {
        if (Platform.OS === "web") {
            switch (size) {
                case "large":
                    return 270;
                case "medium":
                    return 180;
                case "small":
                    return 120;
                case "tiny":
                    return 60;
            }
        }

        switch (size) {
            case "large":
                return (width - theme.spacing.pageHorizontal * 2) * (2 / 3);
            case "medium":
                return (
                    (width -
                        theme.spacing.pageHorizontal * 2 -
                        theme.spacing.pageHorizontal / 2) *
                    (1 / 2)
                );
            case "small":
                return (width - theme.spacing.pageHorizontal * 3) * (1 / 3);
            case "tiny":
                return (width - theme.spacing.pageHorizontal * 4) * (1 / 6);
        }
    }, [size, width, theme.spacing.pageHorizontal]);

    return {
        width: itemWidth,
        height: itemWidth * (3 / 2),
        gap: theme.spacing.pageHorizontal / 2,
    };
};

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
