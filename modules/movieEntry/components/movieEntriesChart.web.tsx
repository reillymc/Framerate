import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { MovieEntry } from "../models";

interface MovieEntriesChartProps {
    entries: Array<MovieEntry>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const MovieEntriesChart: FC<MovieEntriesChartProps> = () => null;
