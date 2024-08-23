import React from "react";
import {
    type ColorValue,
    type OpaqueColorValue,
    type StyleProp,
    StyleSheet,
    type TextStyle,
    View,
    type ViewStyle,
} from "react-native";

import { Octicons } from "@expo/vector-icons";
import {
    type ActionVariant,
    type Theme,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { BlurView } from "expo-blur";

export const getLabelColor = (
    { color }: Theme,
    type: ActionVariant,
    pressed: boolean,
): ColorValue => {
    switch (type) {
        case "primary":
            return pressed ? color.primaryHighlight : color.primary;
        case "secondary":
            return pressed ? color.secondaryHighlight : color.secondary;
        case "flat":
            return pressed ? color.textHighlight : color.textPrimary;
    }

    return color.textInverted;
};

interface MenuIconButtonProps {
    iconName: keyof typeof Octicons.glyphMap;
    color?: string | OpaqueColorValue | undefined;
    variant?: ActionVariant;
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
}

export const MenuIconButton: React.FunctionComponent<MenuIconButtonProps> = ({
    iconName,
    color,
    variant = "primary",
    style,
    iconStyle,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();

    const [menuShown, setMenuShown] = React.useState(false);

    const button = (
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
                color={color ?? getLabelColor(theme, variant, menuShown)}
            />
        </View>
    );

    return button;
};

MenuIconButton.displayName = "MenuIconButton";

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
