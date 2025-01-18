import type { FC, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type {
    MenuActionConfig,
    MenuConfig,
    MenuElementConfig,
} from "react-native-ios-context-menu/build/types/MenuConfig";

export type { MenuActionConfig, MenuElementConfig, MenuConfig };

export interface ContextMenuProps {
    menuConfig: MenuConfig;
    interaction?: "press" | "long-press";
    onPressMenuAction: (e: MenuActionConfig) => void;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children }) => children;
