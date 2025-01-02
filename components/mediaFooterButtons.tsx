import {
    IconActionV2,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Fade
                direction="up"
                width={width}
                height={120}
                fadeOffset={90 - bottom}
                style={styles.fade}
            />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: theme.padding.large,
                    position: "absolute",
                    bottom: -bottom,
                    paddingBottom: bottom + theme.padding.regular,
                    gap: 12,
                    paddingTop: theme.padding.regular,
                    paddingHorizontal: theme.padding.pageHorizontal / 1.5,
                }}
            >
                {onToggleWatchlist && (
                    <Pressable
                        style={{
                            backgroundColor: theme.color.primary,
                            borderRadius: 24,
                            paddingVertical: theme.padding.tiny,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            paddingLeft: theme.padding.small,
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
                            paddingVertical: theme.padding.tiny,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            paddingLeft: theme.padding.small,
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
