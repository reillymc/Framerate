import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import type { FC } from "react";
import type { StyleProp, ViewStyle } from "react-native";

interface WatchlistEntriesChartProps {
    entries: Array<Pick<WatchlistEntrySummary, "mediaReleaseDate" | "mediaId">>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const WatchlistEntriesChart: FC<WatchlistEntriesChartProps> = () => null;
