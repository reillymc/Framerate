import { ImageResources } from "@/assets/images";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { type FC, useMemo } from "react";
import { Image, Pressable, StyleSheet } from "react-native";

interface LogoProps {
    size?: "small" | "medium" | "large";
    onPress?: () => void;
    withTitle?: boolean;
}

export const Logo: FC<LogoProps> = ({
    size = "medium",
    onPress,
    withTitle,
}) => {
    const iconSize = useMemo(() => {
        switch (size) {
            case "small":
                return 40;
            case "medium":
                return 60;
            case "large":
                return 80;
        }
    }, [size]);

    const styles = useThemedStyles(createStyles, {});

    return (
        <Pressable
            onPress={onPress}
            style={styles.logoContainer}
            disabled={!onPress}
        >
            <Image
                source={ImageResources.splash}
                style={{ width: iconSize, height: iconSize }}
            />
            {withTitle && <Text variant="display">Framerate</Text>}
        </Pressable>
    );
};
const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        logoContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: padding.small,
        },
    });
