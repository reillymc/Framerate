import type { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import {
    IconAction,
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
                    <IconAction // TODO move to icon button
                        iconSet={Octicons}
                        variant="primary"
                        iconName={onWatchlist ? "eye-closed" : "eye"}
                        label={onWatchlist ? "On Watchlist" : "Watchlist"}
                        containerStyle={{
                            backgroundColor: theme.color.foreground,
                            borderRadius: 24,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            justifyContent: "center",
                            padding: theme.spacing.small + theme.spacing.tiny,
                        }}
                        onPress={onToggleWatchlist}
                    />
                )}
                {onAddReview && (
                    <IconAction
                        iconSet={Octicons}
                        variant="primary"
                        iconName="plus"
                        label="Add Watch"
                        containerStyle={{
                            backgroundColor: theme.color.foreground,
                            borderRadius: 24,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            justifyContent: "center",
                            padding: theme.spacing.small + theme.spacing.tiny,
                        }}
                        onPress={onAddReview}
                    />
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
