import type { FC } from "react";
import {
    type ColorValue,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    View,
    type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { Octicons } from "@expo/vector-icons";
import {
    type ActionVariant,
    type Theme,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

export const getLabelColor = (
    { color }: Theme,
    type: ActionVariant,
): ColorValue => {
    switch (type) {
        case "primary":
            return color.primary;
        case "secondary":
            return color.secondary;
        case "flat":
            return color.textPrimary;
    }

    return color.textInverted;
};

interface BlurIconActionProps {
    iconName?: keyof typeof Octicons.glyphMap;
    variant?: ActionVariant;
    iconStyle?: StyleProp<TextStyle>;

    style?: StyleProp<ViewStyle>;
}

export const BlurIconAction: FC<BlurIconActionProps> = ({
    iconName,
    iconStyle,
    variant = "secondary",
    style,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();

    return (
        <View style={[styles.container, style]}>
            <BlurView
                intensity={100}
                tint="systemThickMaterial"
                style={StyleSheet.absoluteFill}
            />

            <Octicons
                name={iconName}
                style={iconStyle}
                size={20}
                color={getLabelColor(theme, variant)}
            />
        </View>
    );
};

const createStyles = () => {
    const size = 28;

    return StyleSheet.create({
        container: {
            borderRadius: size / 2,
            height: size,
            width: size,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
        },
    });
};
