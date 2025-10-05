import type { FC } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Octicons } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";
import {
    IconAction,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { Fade } from "./fade";
import { HeaderIconAction } from "./headerIconAction";

interface MediaHeaderProps {
    onWatchlist?: boolean;
    onToggleWatchlist?: () => void;
    onAddReview?: () => void;
}

export const MediaHeaderButtons: FC<MediaHeaderProps> = ({
    onWatchlist,
    onAddReview,
    onToggleWatchlist,
}) => {
    return (
        <>
            {onToggleWatchlist && (
                <HeaderButton>
                    <HeaderIconAction
                        iconSet={Octicons}
                        variant="primary"
                        iconName={onWatchlist ? "eye-closed" : "eye"}
                        onPress={onToggleWatchlist}
                    />
                </HeaderButton>
            )}
            {onAddReview && (
                <HeaderButton>
                    <HeaderIconAction
                        iconSet={Octicons}
                        variant="primary"
                        iconName="plus"
                        onPress={onAddReview}
                    />
                </HeaderButton>
            )}
        </>
    );
};
