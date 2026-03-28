import type { FC } from "react";
import { Pressable, View } from "react-native";
import { Text, useTheme } from "@reillymc/react-native-components";

import { Poster, type PosterProps } from "./poster";

interface PosterCardProps
    extends Pick<PosterProps, "onPress" | "heading" | "asLink"> {
    subHeading?: string;
    imageUri?: string;
    height?: number;
}

export const PosterCard: FC<PosterCardProps> = ({
    heading,
    subHeading,
    imageUri,
    height,
    asLink,
    onPress,
}) => {
    const { theme } = useTheme();

    return (
        <Pressable
            style={{
                height,
                paddingTop: theme.spacing.medium,
                flexDirection: "row",
                paddingHorizontal: theme.spacing.pageHorizontal,
                backgroundColor: theme.color.background,
            }}
            onPress={onPress}
        >
            <Poster imageUri={imageUri} size="tiny" asLink={asLink} />
            <View style={{ flexShrink: 1 }}>
                <Text variant="heading" numberOfLines={2}>
                    {heading}
                </Text>
                {subHeading && <Text variant="caption">{subHeading}</Text>}
            </View>
        </Pressable>
    );
};
