import { type FC, useCallback, useMemo } from "react";
import {
    type StyleProp,
    useWindowDimensions,
    View,
    type ViewStyle,
} from "react-native";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { DeviceType, deviceType } from "expo-device";
import { useTheme } from "@reillymc/react-native-components";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import {
    addDays,
    addMonths,
    endOfMonth,
    startOfMonth,
    subMonths,
} from "date-fns";
import { Bar, CartesianChart, useChartPressState } from "victory-native";

import { FontResources } from "@/assets/fonts";
import { useColorScheme } from "@/hooks";

import { MovieEntryConstants } from "../constants";
import type { MovieWatchlistEntry } from "../models";

const totalMonthCount =
    MovieEntryConstants.monthsBack + MovieEntryConstants.monthsAhead + 1;

interface ChartData extends Record<string, unknown> {
    date: number;
    count: number;
}

interface MovieEntriesChartProps {
    entries: Array<MovieWatchlistEntry>;
    style?: StyleProp<ViewStyle>;
    onPressDate?: (date: Date) => void;
}

export const MovieEntriesChart: FC<MovieEntriesChartProps> = ({
    entries,
    style,
    onPressDate,
}) => {
    const { theme } = useTheme();
    const font = useFont(FontResources.bold, theme.font.size.tiny);
    const scheme = useColorScheme();
    const { width } = useWindowDimensions();

    const { state } = useChartPressState({
        x: 0,
        y: { count: 0 },
    });

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

    const handlePressDate = useCallback(
        (rawDate: number) => {
            const date = addDays(new Date(rawDate), 1);
            onPressDate?.(date);
        },
        [onPressDate],
    );

    useAnimatedReaction(
        () => {
            return state.x.value.value;
        },
        (result) => {
            if (result) {
                runOnJS(handlePressDate)(result);
            }
        },
        [],
    );

    if (!(chartData.length && largestCount)) return null;

    return (
        <View style={style}>
            <CartesianChart
                chartPressState={state}
                data={chartData}
                padding={{ bottom: 2 }}
                xAxis={{
                    font,
                    labelColor: theme.color.background,
                    labelPosition: "inset",
                    axisSide: "bottom",
                    // biome-ignore lint/style/useNamingConvention: victory native prop naming
                    formatXLabel: (value) => {
                        if (!value) return "";
                        return new Date(value).toLocaleString("default", {
                            month: "short",
                        });
                    },
                    tickValues: chartData.map(({ date }) => date),
                    labelOffset:
                        deviceType === DeviceType.PHONE
                            ? theme.spacing.small + theme.spacing.tiny
                            : theme.spacing.medium,
                    lineColor: "transparent",
                }}
                yAxis={[
                    { lineColor: "transparent", domain: [0, largestCount] },
                ]}
                domainPadding={{ left: width / 24, right: width / 24 }}
                xKey="date"
                yKeys={["count"]}
                frame={{ lineColor: "transparent" }}
            >
                {({ points, chartBounds }) => (
                    <Bar
                        points={points.count}
                        chartBounds={chartBounds}
                        animate={{ type: "spring" }}
                        barCount={totalMonthCount}
                        innerPadding={0.12}
                        blendMode="color"
                        roundedCorners={{
                            topLeft: 24,
                            topRight: 24,
                            bottomLeft: 24,
                            bottomRight: 24,
                        }}
                    >
                        <LinearGradient
                            start={vec(0, chartBounds.bottom - chartBounds.top)}
                            end={vec(0, 0)}
                            colors={
                                scheme === "light"
                                    ? [
                                          theme.color.primary,
                                          theme.color.primaryLight,
                                      ]
                                    : [
                                          theme.color.primaryDark,
                                          theme.color.primary,
                                      ]
                            }
                        />
                    </Bar>
                )}
            </CartesianChart>
        </View>
    );
};
