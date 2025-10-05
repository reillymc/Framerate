import type { FC } from "react";
import { Octicons } from "@expo/vector-icons";

import { HeaderIconAction } from "./headerIconAction";

interface HeaderDoneActionProps {
    onDone: () => void;
}

export const HeaderDoneAction: FC<HeaderDoneActionProps> = ({ onDone }) => (
    <HeaderIconAction iconSet={Octicons} iconName="check" onPress={onDone} />
);
