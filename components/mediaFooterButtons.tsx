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
    onWatchlist: boolean;
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
                    left: 0,
                    right: 0,
                    paddingTop: theme.padding.regular,
                    paddingHorizontal: theme.padding.pageHorizontal / 1.5,
                }}
            >
                {onToggleWatchlist && (
                    <Pressable
                        style={{
                            backgroundColor: theme.color.primary,
                            borderRadius: 24,
                            paddingLeft: 6,
                            paddingVertical: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            width: "51%",
                        }}
                        onPress={onToggleWatchlist}
                    >
                        <IconActionV2
                            size="large"
                            iconName={onWatchlist ? "eye-closed" : "eye"}
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
                            {onWatchlist
                                ? "Take off Watchlist"
                                : "Save to Watchlist"}
                        </Text>
                    </Pressable>
                )}
                {onAddReview && (
                    <Pressable
                        style={{
                            backgroundColor: theme.color.primary,
                            borderRadius: 24,
                            paddingLeft: 6,
                            paddingVertical: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            width: "44%",
                        }}
                        onPress={onAddReview}
                    >
                        <IconActionV2
                            size="large"
                            iconName="pencil"
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
                            Add a Review
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
