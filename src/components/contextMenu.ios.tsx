import type { FC } from "react";
import {
    ContextMenuButton,
    ContextMenuView,
    // @ts-expect-error
} from "react-native-ios-context-menu";

import type { ContextMenuProps } from "./contextMenu";

export const ContextMenu: FC<ContextMenuProps> = ({
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
            // @ts-expect-error
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
