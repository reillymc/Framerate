import { Poster } from "@/components/poster";
import { ActiveStatuses, type ShowStatus } from "@/modules/show";
import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { addDays, isBefore, isSameDay, subDays } from "date-fns";
import { type FC, useEffect, useMemo, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { ShowWatchlist, ShowWatchlistEntry } from "../models";

interface ShowUpNextListProps {
    watchlist: ShowWatchlist | undefined;
    onPressShow: (entry: ShowWatchlistEntry) => void;
}

export const ShowUpNextList: FC<ShowUpNextListProps> = ({
    onPressShow,
    watchlist,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const listRef = useRef<ScrollView>(null);
    const todayRef = useRef<View>(null);

    const days = useMemo(() => {
        const currentlyAiringCutOff = addDays(new Date(), 7);

        const entries =
            watchlist?.entries?.filter(
                ({ status, nextAirDate }) =>
                    (status === undefined ||
                        ActiveStatuses.includes(status as ShowStatus)) &&
                    nextAirDate !== undefined &&
                    isBefore(nextAirDate, currentlyAiringCutOff),
            ) ?? [];

        const now = new Date();

        const prevDays = Array.from({ length: 6 }).map((_, i) =>
            subDays(now, i),
        );
        const nextDays = Array.from({ length: 6 }).map((_, i) =>
            addDays(now, i + 1),
        );
        return [...prevDays.reverse(), ...nextDays].map((day) => ({
            day,
            entries: entries.filter(
                (entry) =>
                    entry.nextAirDate && isSameDay(entry.nextAirDate, day),
            ),
        }));
    }, [watchlist?.entries]);

    useEffect(() => {
        if (!days.length) return;
        todayRef.current?.measure((_x, _y, _w, _h, pageX) => {
            const x = pageX - theme.spacing.medium;

            listRef.current?.scrollTo({ x, animated: false });
        });
    }, [days, theme.spacing.medium]);

    return (
        <ScrollView
            contentContainerStyle={styles.calendarContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            ref={listRef}
        >
            <View style={styles.trailContainer}>
                <View style={styles.trail} />
                <View style={styles.trailMedium} />
            </View>
            {days.map((item, index) => (
                <View key={item.day.toDateString()} style={styles.dayContainer}>
                    <View
                        ref={index === 5 ? todayRef : undefined}
                        style={[
                            styles.dayMarker,
                            index === 5 && styles.markerToday,
                        ]}
                    >
                        {!!item.entries.length && (
                            <View style={styles.posterContainer}>
                                {item.entries.map((entry) => (
                                    <Poster
                                        key={entry.showId}
                                        size="tiny"
                                        imageUri={entry.posterPath}
                                        removeMargin
                                        onPress={() => onPressShow(entry)}
                                    />
                                ))}
                            </View>
                        )}
                        <Text variant="bodyEmphasized">
                            {index === 5
                                ? "Today"
                                : item.day.toLocaleString("default", {
                                      weekday:
                                          item.entries.length > 1
                                              ? "long"
                                              : "short",
                                  })}
                        </Text>
                    </View>
                </View>
            ))}
            <View style={styles.trailContainer}>
                <View style={styles.trailMedium} />
                <View style={styles.trail} />
            </View>
        </ScrollView>
    );
};

const createStyles = ({ theme: { spacing, color, border } }: ThemedStyles) =>
    StyleSheet.create({
        calendarContainer: {
            paddingLeft: spacing.pageHorizontal,
            paddingBlock: spacing.medium,
            alignItems: "center",
            minHeight: 160,
        },
        dayContainer: {
            marginHorizontal: spacing.small,
        },
        dayMarker: {
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: color.foreground,
            borderColor: color.primary,
            borderWidth: border.width.regular,
            padding: spacing.small,
            minHeight: 48,
            width: "100%",
            minWidth: 48,
            borderRadius: 24,
        },
        markerToday: {
            backgroundColor: color.primary,
            borderColor: color.foreground,
        },
        posterContainer: {
            flexDirection: "row",
            gap: spacing.tiny,
            marginHorizontal: spacing.tiny,
            marginVertical: spacing.tiny,
        },
        trail: {
            backgroundColor: color.foreground,
            width: 8,
            height: 8,
            borderRadius: border.radius.tight,
            borderColor: color.primary,
            borderWidth: border.width.regular,
            marginHorizontal: spacing.medium,
        },
        trailContainer: {
            marginHorizontal: spacing.small,
            flexDirection: "row",
            alignItems: "center",
        },
        trailMedium: {
            backgroundColor: color.foreground,
            width: 16,
            height: 16,
            borderRadius: border.radius.loose,
            borderColor: color.primary,
            borderWidth: border.width.regular,
        },
    });
