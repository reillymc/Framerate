import type { FC } from "react";
import Octicons from "@react-native-vector-icons/octicons/static";

import { HeaderIconAction } from "./headerIconAction";

interface HeaderCloseActionProps {
    onClose: () => void;
}

export const HeaderCloseAction: FC<HeaderCloseActionProps> = ({ onClose }) => (
    <HeaderIconAction iconSet={Octicons} iconName="x" onPress={onClose} />
);
