import type { FC } from "react";
import { Octicons } from "@expo/vector-icons";

import { HeaderIconAction } from "./headerIconAction";

interface HeaderCloseActionProps {
    onClose: () => void;
}

export const HeaderCloseAction: FC<HeaderCloseActionProps> = ({ onClose }) => (
    <HeaderIconAction iconSet={Octicons} iconName="x" onPress={onClose} />
);
