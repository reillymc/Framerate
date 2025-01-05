import { Text, useTheme } from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, View } from "react-native";
import { Poster, type PosterProps } from "./poster";

interface PosterCardProps
    extends Pick<PosterProps, "onAddReview" | "onPress" | "heading"> {
    subHeading?: string;
    imageUri?: string;
    height?: number;
    onWatchlist?: boolean;
    onToggleWatchlist?: () => void;
}

export const PosterCard: FC<PosterCardProps> = ({
    heading,
    subHeading,
    imageUri,
    height,
    onWatchlist,
    onPress,
    onAddReview,
    onToggleWatchlist,
}) => {
    const { theme } = useTheme();

    return (
        <Pressable
            style={{
                height,
                paddingTop: theme.padding.regular,
                flexDirection: "row",
                paddingHorizontal: theme.padding.pageHorizontal,
                backgroundColor: theme.color.background,
            }}
            onPress={onPress}
        >
            <Poster
                imageUri={imageUri}
                size="tiny"
                onWatchlist={onWatchlist}
                onAddReview={onAddReview}
                onToggleWatchlist={onToggleWatchlist}
            />
            <View style={{ flexShrink: 1 }}>
                <Text variant="heading" numberOfLines={2}>
                    {heading}
                </Text>
                {subHeading && <Text variant="caption">{subHeading}</Text>}
            </View>
        </Pressable>
    );
};
