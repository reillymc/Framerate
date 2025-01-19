import { FontResources } from "@/assets/fonts";
import { useColorScheme } from "@/hooks";
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
import { View } from "react-native";
import {
    type SharedValue,
    runOnJS,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";
import {
    CartesianChart,
    Line,
    Scatter,
    useChartPressState,
} from "victory-native";
import { ratingToStars } from "../helpers";
import type { Review } from "../models";

interface ChartData extends Record<string, unknown> {
    date: number;
    rating: number;
    filteredRatings: number | undefined;
}

interface RatingHistoryChartProps {
    reviews: Array<Pick<Review, "date" | "rating">>;
    starCount: number;
}

export const RatingHistoryChart: FC<RatingHistoryChartProps> = ({
    reviews,
    starCount,
}) => {
    const font = useFont(FontResources.regular, 12);
    const { state, isActive } = useChartPressState({
        x: 0,
        y: { rating: 0, filteredRatings: 0 },
    });
    const { theme } = useTheme();

    const hasUnknownDates = useMemo(
        () => reviews?.some((r) => !r.date),
        [reviews],
    );

    const scheme = useColorScheme();

    const chartData: ChartData[] = useMemo(() => {
        const sorted = [...(reviews ?? [])]
            .filter(({ rating }) => rating !== undefined)
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

        return sorted.map(({ date, rating = 0 }): ChartData => {
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

    if (chartData.length < 2) return null;

    return (
        <View style={{ height: 160 }}>
            <CartesianChart
                chartPressState={state}
                data={chartData}
                frame={{
                    lineWidth: 0,
                }}
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
                        x: 0,
                        y: 0,
                    },
                    labelOffset: theme.spacing.small,
                    lineColor: {
                        grid: "transparent",
                        frame: "transparent",
                    },
                }}
                domainPadding={{
                    left: theme.spacing.medium,
                    right: theme.spacing.medium,
                }}
                xKey="date"
                domain={{ y: [0, 124] }}
                yKeys={["rating", "filteredRatings"]}
                renderOutside={({ chartBounds }) => (
                    <>
                        {isActive && (
                            <ActiveValueIndicator
                                xPosition={state.x.position}
                                yPosition={state.y.rating.position}
                                bottom={chartBounds.bottom}
                                top={chartBounds.top}
                                activeValue={state.y.rating.value}
                                filteredValue={state.y.filteredRatings.value}
                                activeDate={state.x.value}
                                lineColor={theme.color.primary}
                                textColor={theme.color.primaryDark}
                                starCount={starCount}
                            />
                        )}
                    </>
                )}
            >
                {({ points, chartBounds }) => (
                    <>
                        <Line
                            points={points.rating}
                            curveType="cardinal50"
                            strokeWidth={theme.border.width.regular}
                            color={theme.color.primary}
                            animate={{ type: "spring" }}
                            strokeCap="round"
                        >
                            {hasUnknownDates ? (
                                <LinearGradient
                                    start={vec(12, 0)}
                                    end={vec(60, 0)}
                                    colors={[
                                        `${theme.color.background}00`,
                                        scheme === "light"
                                            ? theme.color.primary
                                            : theme.color.primaryDark,
                                    ]}
                                />
                            ) : (
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(
                                        0,
                                        chartBounds.bottom - chartBounds.top,
                                    )}
                                    colors={
                                        scheme === "light"
                                            ? [
                                                  theme.color.primaryLight,
                                                  theme.color.primary,
                                              ]
                                            : [
                                                  theme.color.primary,
                                                  theme.color.primaryDark,
                                              ]
                                    }
                                />
                            )}
                        </Line>
                        <Scatter
                            points={points.filteredRatings}
                            shape="circle"
                            radius={5}
                            style="fill"
                            animate={{ type: "spring" }}
                            color={
                                scheme === "light"
                                    ? theme.color.primaryDark
                                    : theme.color.primaryLight
                            }
                        />
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
    starCount: number;
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
    starCount,
}) => {
    const topOffset = 2;
    const fontSizeRegular = 10;
    const fontSizeBold = 14;
    const fontRegular = useFont(FontResources.regular, fontSizeRegular);
    const fontBold = useFont(FontResources.bold, fontSizeBold);
    const start = useDerivedValue(() => vec(xPosition.value, bottom));
    const end = useDerivedValue(() =>
        vec(
            xPosition.value,
            top + 1.5 * fontSizeRegular + topOffset + 1.5 * fontSizeBold + 2,
        ),
    );

    const activeValueDisplay = useSharedValue("");

    const wrapper = (rating: number, stars: number) => {
        activeValueDisplay.value = ratingToStars(rating, stars).toString();
    };

    useDerivedValue(() => {
        runOnJS(wrapper)(activeValue.value, starCount);
    });

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
