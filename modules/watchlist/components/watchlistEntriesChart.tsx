import { fonts } from "@/assets/fonts";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import { useTheme } from "@reillymc/react-native-components";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import {
    addDays,
    addMonths,
    endOfMonth,
    startOfMonth,
    subMonths,
} from "date-fns";
import { type FC, useEffect, useMemo } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import { Bar, CartesianChart, useChartPressState } from "victory-native";

interface ChartData extends Record<string, unknown> {
    date: number;
    count: number;
}

interface WatchlistEntriesChartProps {
    entries: Array<Pick<WatchlistEntrySummary, "mediaReleaseDate" | "mediaId">>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const WatchlistEntriesChart: FC<WatchlistEntriesChartProps> = ({
    entries,
    style,
    onPressDate,
}) => {
    const font = useFont(fonts.dosisSemiBold, 12);

    const { state } = useChartPressState({
        x: 0,
        y: { count: 0, date: 0 },
    });
    const { theme } = useTheme();

    const chartData: ChartData[] = useMemo(() => {
        const now = subMonths(new Date(), 1);

        const transformedEntries = [...(entries ?? [])].map((review) => ({
            ...review,
            date: review.mediaReleaseDate
                ? new Date(review.mediaReleaseDate)
                : undefined,
        }));

        const months = Array.from({ length: 6 }).map((_, i) =>
            addMonths(now, i),
        );

        const data = months.map((month) => {
            const monthStart = startOfMonth(month).getTime();
            const monthEnd = endOfMonth(month).getTime();
            const monthEntries = transformedEntries.filter(
                (entry) =>
                    entry.date &&
                    entry.date.getTime() <= monthEnd &&
                    entry.date.getTime() > monthStart,
            );

            return {
                date: monthStart,
                count: monthEntries.length,
            };
        });

        return data;
    }, [entries]);

    const largestCount = useMemo(
        () => Math.max(...chartData.map((d) => d.count)),
        [chartData],
    );

    useEffect(() => {
        if (!state.x.value.value) return;

        const date = new Date(state.x.value.value);
        if (onPressDate) onPressDate(date);
    }, [state.x.value.value, onPressDate]);

    if (!(chartData.length && largestCount)) return null;

    return (
        <View style={style}>
            <CartesianChart
                chartPressState={state}
                data={chartData}
                axisOptions={{
                    font,
                    labelColor: {
                        x: theme.color.background,
                        y: "black",
                    },
                    labelPosition: {
                        x: "inset",
                        y: "inset",
                    },

                    axisSide: {
                        x: "bottom",
                        y: "right",
                    },
                    // biome-ignore lint/style/useNamingConvention: <explanation>
                    formatXLabel: (value) => {
                        if (!value) return "";
                        const date = new Date(value);

                        return addDays(date, 1).toLocaleString("default", {
                            month: "short",
                        });
                    },
                    tickValues: {
                        x: chartData.map((d) => d.date),
                        y: [0, largestCount],
                    },
                    labelOffset: 10,
                    lineColor: "transparent",
                }}
                domainPadding={{ left: 18, right: 18 }}
                xKey="date"
                yKeys={["count"]}
            >
                {({ points, chartBounds }) => (
                    <Bar
                        points={points.count}
                        chartBounds={chartBounds}
                        color={theme.color.primary}
                        opacity={0.75}
                        animate={{ type: "spring" }}
                        blendMode="color"
                        roundedCorners={{
                            topLeft: 16,
                            topRight: 16,
                            bottomLeft: 16,
                            bottomRight: 16,
                        }}
                    >
                        <LinearGradient
                            start={vec(0, chartBounds.bottom - chartBounds.top)}
                            end={vec(0, 0)}
                            colors={[
                                `${theme.color.primaryHighlight}`,
                                theme.color.primary,
                            ]}
                        />
                    </Bar>
                )}
            </CartesianChart>
        </View>
    );
};
