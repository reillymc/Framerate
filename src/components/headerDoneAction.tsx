import type { FC } from "react";
import Octicons from "@react-native-vector-icons/octicons/static";

import { HeaderIconAction } from "./headerIconAction";

interface HeaderDoneActionProps {
    onDone: () => void;
}

export const HeaderDoneAction: FC<HeaderDoneActionProps> = ({ onDone }) => (
    <HeaderIconAction iconSet={Octicons} iconName="check" onPress={onDone} />
);
