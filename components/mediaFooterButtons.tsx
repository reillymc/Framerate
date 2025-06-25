import type { FC } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    IconActionV2,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { Fade } from "./fade";

interface MediaFooterButtonsProps {
    onWatchlist?: boolean;
    onToggleWatchlist?: () => void;
    onAddReview?: () => void;
}

export const MediaFooterButtons: FC<MediaFooterButtonsProps> = ({
    onWatchlist,
    onAddReview,
    onToggleWatchlist,
}) => {
    const { bottom } = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const { theme } = useTheme();

    const styles = useThemedStyles(createStyles, {});

    const fadeBottom = bottom + 24;

    return (
        <>
            <Fade
                direction="up"
                width={width}
                height={36}
                fadeOffset={0}
                style={[styles.fade, { bottom: fadeBottom }]}
            />
            <View
                style={{
                    position: "absolute",
                    top: height - fadeBottom,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: theme.color.background,
                }}
            />
            <View
                style={{
                    position: "absolute",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    bottom,
                    paddingBottom: theme.spacing.medium,
                    gap: 12,
                    paddingHorizontal: theme.spacing.pageHorizontal / 1.5,
                }}
            >
                {onToggleWatchlist && (
                    <Pressable
                        style={{
                            backgroundColor: theme.color.primary,
                            borderRadius: 24,
                            paddingVertical: theme.spacing.tiny,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            paddingLeft: theme.spacing.small,
                        }}
                        onPress={onToggleWatchlist}
                    >
                        <IconActionV2
                            size="large"
                            iconName={onWatchlist ? "eye-closed" : "eye"}
                            iconStyle={{ color: "white" }}
                            containerStyle={{ backgroundColor: "transparent" }}
                        />
                        <Text
                            variant="bodyEmphasized"
                            style={{ color: "white" }}
                        >
                            {onWatchlist ? "On Watchlist" : "Watchlist"}
                        </Text>
                    </Pressable>
                )}
                {onAddReview && (
                    <Pressable
                        style={{
                            backgroundColor: theme.color.primary,
                            borderRadius: 24,
                            paddingVertical: theme.spacing.tiny,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            paddingLeft: theme.spacing.small,
                        }}
                        onPress={onAddReview}
                    >
                        <IconActionV2
                            size="large"
                            iconName="plus"
                            iconStyle={{
                                color: "white",
                            }}
                            containerStyle={{
                                backgroundColor: "transparent",
                            }}
                        />
                        <Text
                            variant="label"
                            style={{
                                color: "white",
                                marginLeft: 1,
                            }}
                        >
                            Add Watch
                        </Text>
                    </Pressable>
                )}
            </View>
        </>
    );
};

const createStyles = (_: ThemedStyles) =>
    StyleSheet.create({
        fade: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
