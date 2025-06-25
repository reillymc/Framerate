import type React from "react";
import {
    ContextMenuButton,
    ContextMenuView,
} from "react-native-ios-context-menu";

import type { ContextMenuProps } from "./contextMenu";

export const ContextMenu: React.FunctionComponent<ContextMenuProps> = ({
    menuConfig,
    interaction = "press",
    style,
    onPressMenuAction,
    children,
}) => {
    const ContextMenuComponent =
        interaction === "press" ? ContextMenuButton : ContextMenuView;

    return (
        <ContextMenuComponent
            isMenuPrimaryAction
            onPressMenuItem={({ nativeEvent }) =>
                onPressMenuAction(nativeEvent)
            }
            menuConfig={menuConfig}
            style={style}
        >
            {children}
        </ContextMenuComponent>
    );
};

ContextMenu.displayName = "MenuIconButton";
