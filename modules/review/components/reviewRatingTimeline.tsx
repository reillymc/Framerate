import { fonts } from "@/assets/fonts";
import { useTheme } from "@reillymc/react-native-components";
import {
    Circle,
    LinearGradient,
    Line as SkiaLine,
    Text as SkiaText,
    useFont,
    vec,
} from "@shopify/react-native-skia";
import { subYears } from "date-fns";
import { type FC, useMemo } from "react";
import { View, useWindowDimensions } from "react-native";
import { type SharedValue, useDerivedValue } from "react-native-reanimated";
import {
    CartesianChart,
    Line,
    Scatter,
    useChartPressState,
} from "victory-native";
import type { ReviewSummary } from "../services";

interface ChartData extends Record<string, unknown> {
    date: number;
    rating: number;
    filteredRatings: number | undefined;
}

interface ReviewRatingTimelineProps {
    reviews: Array<Pick<ReviewSummary, "date" | "rating">>;
    chartHeight?: number;
}

export const ReviewRatingTimeline: FC<ReviewRatingTimelineProps> = ({
    reviews,
    chartHeight = 240,
}) => {
    const font = useFont(fonts.dosis, 12);

    const { state, isActive } = useChartPressState({
        x: 0,
        y: { rating: 0, filteredRatings: 0 },
    });
    const { theme } = useTheme();

    const hasUnknownDates = useMemo(
        () => reviews?.some((r) => !r.date),
        [reviews],
    );

    const { width } = useWindowDimensions();

    const chartData: ChartData[] = useMemo(() => {
        const sorted = [...(reviews ?? [])]
            .map((review) => ({
                ...review,
                date: review.date ? new Date(review.date) : undefined,
            }))
            .sort((a, b) => {
                if (!a.date) return -1;
                if (!b.date) return 1;
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
                return 0;
            });

        return sorted.map(({ date, rating }): ChartData => {
            if (date) {
                return {
                    date: date.getTime(),
                    rating,
                    filteredRatings: rating,
                };
            }
            const oldestDateInList = sorted.find((r) => r.date)?.date;
            const newestDateInList = sorted
                .slice()
                .reverse()
                .find((r) => r.date)?.date;

            if (!(oldestDateInList && newestDateInList))
                return {
                    date: new Date().getTime(),
                    rating: rating,
                    filteredRatings: undefined,
                };

            if (oldestDateInList === newestDateInList) {
                return {
                    date: subYears(oldestDateInList.getTime(), 1).getTime(),
                    rating,
                    filteredRatings: undefined,
                };
            }

            const timeBetween =
                newestDateInList.getTime() - oldestDateInList.getTime();

            const finalDate = new Date(
                oldestDateInList.getTime() - timeBetween / 2,
            );

            return {
                date: finalDate.getTime(),
                rating: rating,
                filteredRatings: undefined,
            };
        });
    }, [reviews]);

    return (
        <View style={{ height: chartHeight }}>
            <CartesianChart
                chartPressState={state}
                data={chartData}
                axisOptions={{
                    font,
                    labelColor: theme.color.textPrimary,
                    labelPosition: {
                        x: "outset",
                        y: "inset",
                    },
                    // biome-ignore lint/style/useNamingConvention: <explanation>
                    formatXLabel: (value) => {
                        if (!value) return "";
                        const date = new Date(value);

                        return date.toLocaleString("default", {
                            month: "short",
                            year: "numeric",
                        });
                    },
                    tickCount: {
                        x: 3,
                        y: 0,
                    },
                    labelOffset: 8,
                    lineColor: {
                        grid: theme.color.border,
                        frame: "transparent",
                    },
                }}
                domainPadding={theme.padding.regular}
                xKey="date"
                domain={{ y: [0, 114] }}
                yKeys={["rating", "filteredRatings"]}
                renderOutside={({ chartBounds }) => (
                    <>
                        {isActive && (
                            <>
                                <ActiveValueIndicator
                                    xPosition={state.x.position}
                                    yPosition={state.y.rating.position}
                                    bottom={chartBounds.bottom}
                                    top={chartBounds.top}
                                    activeValue={state.y.rating.value}
                                    filteredValue={
                                        state.y.filteredRatings.value
                                    }
                                    activeDate={state.x.value}
                                    lineColor={theme.color.primary}
                                    textColor={theme.color.primaryHighlight}
                                />
                            </>
                        )}
                    </>
                )}
            >
                {({ points }) => (
                    <>
                        <Line
                            points={points.rating}
                            color={theme.color.primary}
                            curveType="cardinal50"
                            strokeWidth={2}
                            opacity={0.75}
                            animate={{ type: "spring" }}
                            strokeCap="round"
                        >
                            {hasUnknownDates ? (
                                <LinearGradient
                                    start={vec(12, 0)}
                                    end={vec(60, 0)}
                                    colors={[
                                        `${theme.color.background}00`,
                                        theme.color.primaryHighlight,
                                    ]}
                                />
                            ) : (
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(width / 2, chartHeight)}
                                    colors={[
                                        theme.color.primary,
                                        theme.color.primaryHighlight,
                                    ]}
                                />
                            )}
                        </Line>
                        <Scatter
                            points={points.filteredRatings}
                            shape="circle"
                            radius={5}
                            style="fill"
                            animate={{ type: "spring" }}
                            color={theme.color.primary}
                        >
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(0, chartHeight)}
                                colors={[
                                    theme.color.primary,
                                    theme.color.primaryHighlight,
                                ]}
                            />
                        </Scatter>
                    </>
                )}
            </CartesianChart>
        </View>
    );
};

type ActiveValueIndicatorProps = {
    xPosition: SharedValue<number>;
    yPosition: SharedValue<number>;
    activeValue: SharedValue<number>;
    filteredValue: SharedValue<number>;
    activeDate: SharedValue<number>;
    bottom: number;
    top: number;
    lineColor: string;
    textColor: string;
};
const ActiveValueIndicator: FC<ActiveValueIndicatorProps> = ({
    xPosition,
    yPosition,
    top,
    bottom,
    activeValue,
    filteredValue,
    activeDate,
    lineColor,
    textColor,
}) => {
    const topOffset = 2;
    const fontSizeRegular = 10;
    const fontSizeBold = 14;
    const fontRegular = useFont(fonts.dosis, fontSizeRegular);
    const fontBold = useFont(fonts.dosisBold, fontSizeBold);
    const start = useDerivedValue(() => vec(xPosition.value, bottom));
    const end = useDerivedValue(() =>
        vec(
            xPosition.value,
            top + 1.5 * fontSizeRegular + topOffset + 1.5 * fontSizeBold + 2,
        ),
    );

    // Text label
    const activeValueDisplay = useDerivedValue(() =>
        (activeValue.value / 10).toString(),
    );
    const activeValueWidth = useDerivedValue(
        () => fontBold?.measureText(activeValueDisplay.value).width || 0,
    );
    const activeValueX = useDerivedValue(
        () => xPosition.value - activeValueWidth.value / 2,
    );

    const activeDateDisplay = useDerivedValue(() =>
        filteredValue.value
            ? new Date(activeDate.value).toLocaleString("default", {
                  month: "numeric",
                  year: "2-digit",
              })
            : "...",
    );
    const activeDateWidth = useDerivedValue(
        () => fontRegular?.measureText(activeDateDisplay.value).width || 0,
    );
    const activeDateX = useDerivedValue(
        () => xPosition.value - activeDateWidth.value / 2,
    );

    const radius = useDerivedValue(() => (filteredValue.value ? 6 : 0));

    return (
        <>
            <SkiaLine p1={start} p2={end} color={lineColor} strokeWidth={1} />

            {radius && (
                <Circle
                    cx={xPosition}
                    cy={yPosition}
                    r={radius}
                    color={lineColor}
                />
            )}

            <SkiaText
                color={textColor}
                font={fontBold}
                text={activeValueDisplay}
                x={activeValueX}
                y={top + fontSizeRegular + topOffset}
            />
            <SkiaText
                color={textColor}
                font={fontRegular}
                text={activeDateDisplay}
                x={activeDateX}
                y={top + fontSizeRegular + topOffset + fontSizeBold}
            />
        </>
    );
};
