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
import { useMemo } from "react";
import {
    ContextMenuView,
    type MenuConfig,
    type MenuElementConfig,
} from "react-native-ios-context-menu";
import { TmdbImage } from "./tmdbImage";

export interface PosterProps {
    imageUri?: string;
    heading?: string;
    removeMargin?: boolean;
    style?: StyleProp<ViewStyle>;
    size?: "tiny" | "small" | "medium" | "large";
    onWatchlist?: boolean;
    onPress?: () => void;
    onToggleWatchlist?: () => void;
    onAddReview?: () => void;
}

export const Poster: React.FC<PosterProps> = ({
    heading,
    style,
    imageUri,
    removeMargin = false,
    size = "large",
    onWatchlist,
    onPress,
    onAddReview,
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
                    <ContextMenuView
                        isContextMenuEnabled={false}
                        menuConfig={
                            {
                                menuTitle: "",
                                menuItems: [
                                    onAddReview
                                        ? {
                                              actionKey: "review",
                                              actionTitle: "Add Review",
                                              icon: {
                                                  type: "IMAGE_SYSTEM",
                                                  imageValue: {
                                                      systemName: "pencil",
                                                  },
                                              },
                                          }
                                        : undefined,
                                    watchlistAction,
                                ].filter(Undefined),
                            } as MenuConfig
                        }
                        onPressMenuItem={({ nativeEvent: { actionKey } }) => {
                            switch (actionKey) {
                                case "view":
                                    onPress?.();
                                    break;
                                case "review":
                                    onAddReview?.();
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
                    </ContextMenuView>
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
            case "tiny":
                return (width - theme.padding.pageHorizontal * 4) * (1 / 6);
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
            marginBottom: removeMargin ? undefined : listItem.spacingMargin,
            width,
            marginRight: removeMargin ? undefined : gap,
            borderRadius: ["small", "tiny"].includes(size)
                ? border.radius.regular
                : border.radius.loose,
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
        contextMenu: {
            borderRadius: ["small", "tiny"].includes(size)
                ? border.radius.regular
                : border.radius.loose,
        },
    });
