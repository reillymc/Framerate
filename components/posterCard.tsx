import { Text, useTheme } from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, View } from "react-native";
import { Poster, type PosterProps } from "./poster";

interface PosterCardProps
    extends Pick<PosterProps, "onAddReview" | "onPress" | "heading"> {
    releaseDate?: string;
    imageUri?: string;
    height?: number;
    onRemoveFromWatchlist?: () => void;
}

export const PosterCard: FC<PosterCardProps> = ({
    heading,
    releaseDate,
    imageUri,
    height,
    onPress,
    onAddReview,
    onRemoveFromWatchlist,
}) => {
    const { theme } = useTheme();

    return (
        <Pressable
            style={{
                height,
                paddingTop: theme.padding.regular,
                flexDirection: "row",
                paddingHorizontal: theme.padding.pageHorizontal,
            }}
            onPress={onPress}
        >
            <Poster
                imageUri={imageUri}
                size="tiny"
                onWatchlist
                onAddReview={onAddReview}
                onToggleWatchlist={onRemoveFromWatchlist}
            />
            <View style={{ flexShrink: 1 }}>
                <Text variant="heading" numberOfLines={2}>
                    {heading}
                </Text>
                {releaseDate && <Text variant="body">{releaseDate}</Text>}
            </View>
        </Pressable>
    );
};

PosterCard.displayName = "PosterCard";
