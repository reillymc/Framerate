import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import type { MovieWatchlistEntry } from "../models";

interface MovieEntriesChartProps {
    entries: Array<MovieWatchlistEntry>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const MovieEntriesChart: FC<MovieEntriesChartProps> = () => null;
