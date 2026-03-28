import type { FC, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type {
    MenuActionConfig,
    MenuConfig,
    MenuElementConfig,
    // @ts-expect-error
} from "react-native-ios-context-menu/build/types/MenuConfig";

// biome-ignore lint/style/useComponentExportOnlyModules: TODO component to be removed
export type { MenuActionConfig, MenuConfig, MenuElementConfig };

export interface ContextMenuProps {
    menuConfig: MenuConfig;
    interaction?: "press" | "long-press";
    onPressMenuAction: (e: MenuActionConfig) => void;
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
}

export const ContextMenu: FC<ContextMenuProps> = ({ children }) => children;
