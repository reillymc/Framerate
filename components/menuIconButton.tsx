import type React from "react";
import type {
    ColorValue,
    OpaqueColorValue,
    StyleProp,
    TextStyle,
    ViewStyle,
} from "react-native";

import type { Octicons } from "@expo/vector-icons";
import type { ActionVariant, Theme } from "@reillymc/react-native-components";
import type { MenuConfig } from "react-native-ios-context-menu/build/types/MenuConfig";
import type { OnPressMenuItemEvent } from "react-native-ios-context-menu/build/types/MenuEvents";

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
    menuConfig: MenuConfig;
    onPressMenuItem: OnPressMenuItemEvent;
    color?: string | OpaqueColorValue | undefined;
    variant?: ActionVariant;
    style?: StyleProp<ViewStyle>;
    iconStyle?: StyleProp<TextStyle>;
}

export const MenuIconButton: React.FunctionComponent<
    MenuIconButtonProps
> = () => null;

MenuIconButton.displayName = "MenuIconButton";
