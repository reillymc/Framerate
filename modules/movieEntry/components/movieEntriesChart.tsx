import { FontResources } from "@/assets/fonts";
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
import { MovieEntryConstants } from "../constants";
import type { MovieEntry } from "../models";

const totalMonthCount =
    MovieEntryConstants.monthsBack + MovieEntryConstants.monthsAhead + 1;

interface ChartData extends Record<string, unknown> {
    date: number;
    count: number;
}

interface MovieEntriesChartProps {
    entries: Array<MovieEntry>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const MovieEntriesChart: FC<MovieEntriesChartProps> = ({
    entries,
    style,
    onPressDate,
}) => {
    const font = useFont(FontResources.bold, 12);

    const { state } = useChartPressState({
        x: 0,
        y: { count: 0 },
    });
    const { theme } = useTheme();

    const chartData: ChartData[] = useMemo(() => {
        const firstMonth = startOfMonth(
            subMonths(new Date(), MovieEntryConstants.monthsBack),
        );

        const transformedEntries = [...(entries ?? [])].map((review) => ({
            ...review,
            date: review.releaseDate ? new Date(review.releaseDate) : undefined,
        }));

        const months = Array.from({
            length: totalMonthCount,
        }).map((_, i) => addMonths(firstMonth, i));

        const data = months.map((month) => {
            const monthStart = startOfMonth(month).getTime();
            const monthEnd = endOfMonth(month).getTime();
            const monthEntries = transformedEntries.filter(
                ({ date }) =>
                    date &&
                    date.getTime() <= monthEnd &&
                    date.getTime() > monthStart,
            );

            return {
                date: monthStart,
                count: monthEntries.length,
            };
        });

        return data;
    }, [entries]);

    const largestCount = useMemo(
        () => Math.max(...chartData.map(({ count }) => count)),
        [chartData],
    );

    useEffect(() => {
        if (!state.x.value.value) return;

        const date = addDays(new Date(state.x.value.value), 1);
        onPressDate?.(date);
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
                    // biome-ignore lint/style/useNamingConvention: victory native prop naming
                    formatXLabel: (value) => {
                        if (!value) return "";
                        return new Date(value).toLocaleString("default", {
                            month: "short",
                        });
                    },
                    tickValues: {
                        x: chartData.map(({ date }) => date),
                        y: [0, largestCount],
                    },
                    labelOffset: 10,
                    lineColor: "transparent",
                }}
                domainPadding={{
                    left: theme.padding.regular,
                    right: theme.padding.regular,
                }}
                xKey="date"
                yKeys={["count"]}
                frame={{ lineColor: "transparent" }}
            >
                {({ points, chartBounds }) => (
                    <Bar
                        points={points.count}
                        chartBounds={chartBounds}
                        color={theme.color.primary}
                        opacity={0.7}
                        animate={{ type: "spring" }}
                        barCount={totalMonthCount}
                        innerPadding={0.1}
                        blendMode="color"
                        roundedCorners={{
                            topLeft: theme.border.radius.loose,
                            topRight: theme.border.radius.loose,
                            bottomLeft: theme.border.radius.loose,
                            bottomRight: theme.border.radius.loose,
                        }}
                    >
                        <LinearGradient
                            start={vec(0, chartBounds.bottom - chartBounds.top)}
                            end={vec(0, 0)}
                            colors={[
                                theme.color.primaryHighlight,
                                theme.color.primary,
                            ]}
                        />
                    </Bar>
                )}
            </CartesianChart>
        </View>
    );
};
