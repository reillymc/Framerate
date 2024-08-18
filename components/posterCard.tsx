import { Text, useTheme } from "@reillymc/react-native-components";
import type { FC } from "react";
import { Pressable, View } from "react-native";
import { Poster } from "./poster";

interface PosterCardProps {
    title: string;
    releaseDate?: string;
    imageUri?: string;
    height?: number;
    onPress: () => void;
}

export const PosterCard: FC<PosterCardProps> = ({
    title,
    releaseDate,
    imageUri,
    height,
    onPress,
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
            <Poster imageUri={imageUri} size="tiny" />
            <View style={{ flexShrink: 1 }}>
                <Text variant="heading" numberOfLines={2}>
                    {title}
                </Text>
                {releaseDate && <Text variant="body">{releaseDate}</Text>}
            </View>
        </Pressable>
    );
};

PosterCard.displayName = "PosterCard";
