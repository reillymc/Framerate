import { type FC, useCallback, useMemo } from "react";
import {
    Platform,
    Pressable,
    type StyleProp,
    StyleSheet,
    useWindowDimensions,
    View,
    type ViewStyle,
} from "react-native";
import { DeviceType, deviceType } from "expo-device";
import {
    Text,
    type ThemedStyles,
    Undefined,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ContextMenu, type MenuElementConfig } from "./contextMenu";
import { TmdbImage } from "./tmdbImage";

type Size = "tiny" | "small" | "medium" | "large";

const PosterCountPhone: Record<Size, number> = {
    large: 1,
    medium: 2,
    small: 3,
    tiny: 6,
};

const PosterCountTablet: Record<Size, number> = {
    large: 3,
    medium: 4,
    small: 5,
    tiny: 8,
};

const PosterWidthWeb: Record<Size, number> = {
    large: 270,
    medium: 180,
    small: 140,
    tiny: 60,
};

export interface PosterProps {
    imageUri?: string;
    heading?: string;
    subHeading?: string;
    removeMargin?: boolean;
    teaseSpacing?: boolean;
    style?: StyleProp<ViewStyle>;
    size?: Size;
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
    teaseSpacing = false,
    size = "large",
    onWatchlist,
    onPress,
    onAddReview,
    onOpenReview,
    onToggleWatchlist,
}) => {
    const { height, width, gap } = usePosterDimensions({ size, teaseSpacing });

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

type PosterParams = Pick<Required<PosterProps>, "size"> &
    Pick<PosterProps, "teaseSpacing">;

export type PosterProperties = {
    width: number;
    height: number;
    gap: number;
    interval: number;
    displayCount: number | undefined;
    configuration: PosterParams;
};

type UsePosterDimensionsParams = (params: PosterParams) => PosterProperties;

export const usePosterDimensions: UsePosterDimensionsParams = ({
    size,
    teaseSpacing,
}) => {
    const { width: screenWidth } = useWindowDimensions();
    const { theme } = useTheme();

    const gap = theme.spacing.pageHorizontal / 2;

    const calcWidth = useCallback(
        (posterCount: number) => {
            const pageSideSpacing = theme.spacing.pageHorizontal * 2;

            const posterInnerGaps =
                (theme.spacing.pageHorizontal * posterCount - 1) / 2;

            const posterFullScreenWidth =
                screenWidth - pageSideSpacing - posterInnerGaps + gap;

            const scaledPosterWidth =
                posterFullScreenWidth *
                (1 / (posterCount + (teaseSpacing ? 1 / 3 : 0)));

            return scaledPosterWidth;
        },
        [screenWidth, gap, teaseSpacing, theme.spacing.pageHorizontal],
    );

    const dimensions = useMemo(() => {
        if (Platform.OS !== "web") {
            const itemCount =
                deviceType === DeviceType.TABLET
                    ? PosterCountTablet[size]
                    : PosterCountPhone[size];

            const width = calcWidth(itemCount);

            return {
                width,
                height: width * (3 / 2),
                gap,
                interval: width + gap,
                displayCount: itemCount,
                configuration: { size, teaseSpacing },
            };
        }

        const width = PosterWidthWeb[size];

        return {
            width,
            height: width * (3 / 2),
            gap,
            interval: width + gap,
            displayCount: Math.floor(
                (screenWidth - theme.spacing.pageHorizontal * 2) /
                    (width + gap),
            ),
            configuration: { size, teaseSpacing },
        };
    }, [
        calcWidth,
        size,
        teaseSpacing,
        screenWidth,
        gap,
        theme.spacing.pageHorizontal,
    ]);

    return dimensions;
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
