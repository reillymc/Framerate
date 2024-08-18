import { PosterCard } from "@/components";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useWatchlist } from "@/modules/watchlist";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { lastDayOfMonth, subMonths } from "date-fns";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useCallback, useMemo, useRef } from "react";
import { SectionList, StyleSheet, View, useColorScheme } from "react-native";

const HEADER_HEIGHT = 96;
const ITEM_HEIGHT = 92;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

const buildGetItemLayout = getItemLayout<WatchlistEntrySummary>({
    getItemHeight: ITEM_HEIGHT,
    getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
    getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
});

type WatchlistSection = {
    showMonth: boolean;
    yearTitle?: string;
    data: WatchlistEntrySummary[];
    date: Date;
};

const now = new Date();

const Watchlist: FC = () => {
    const { mediaType, date: rawDate } = useLocalSearchParams<{
        mediaType: string;
        date?: string;
    }>();

    const date = rawDate ? new Date(rawDate) : undefined;

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const listRef = useRef<SectionList<WatchlistEntrySummary> | null>(null);
    const scheme = useColorScheme();

    const { data: watchlist } = useWatchlist(mediaType);
    const { data: entries = [], isLoading } = useWatchlistEntries(mediaType);

    const sectionData = useMemo(() => {
        const sections = Object.values(
            entries.reduce<Record<string, WatchlistSection>>((acc, entry) => {
                const date = new Date(entry.mediaReleaseDate ?? 0);
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();
                const key = `${month} ${year}`;

                const olderCutOff = subMonths(now, 3);

                if (date < olderCutOff) {
                    if (acc.Older) {
                        acc.Older.data.push(entry);
                    } else {
                        acc.Older = {
                            yearTitle: "Older",
                            showMonth: false,
                            data: [entry],
                            date: subMonths(new Date(), 1),
                        };
                    }
                } else if (acc[key]) {
                    acc[key].data.push(entry);
                } else {
                    acc[key] = {
                        showMonth: true,
                        yearTitle: year.toString(),
                        date: new Date(
                            year,
                            date.getMonth(),
                            lastDayOfMonth(date).getDate(),
                        ),
                        data: [entry],
                    };
                }

                return acc;
            }, {}),
        );

        const uniqueSections: WatchlistSection[] = [];
        const processedYears = new Set<string>();

        for (const section of sections) {
            if (section.yearTitle) {
                if (processedYears.has(section.yearTitle)) {
                    const { yearTitle, ...rest } = section;
                    uniqueSections.push(rest);
                } else {
                    processedYears.add(section.yearTitle);
                    uniqueSections.push(section);
                }
            } else if (section.yearTitle === "Older") {
                uniqueSections.push(section);
            }
        }

        return uniqueSections;
    }, [entries]);

    const scrollToCurrentSection = useCallback(() => {
        if (!listRef.current) return;

        const closest = sectionData
            .toReversed()
            .find((section) => section.date >= (date ?? now));

        if (!closest) return;

        listRef.current.scrollToLocation({
            animated: false,
            sectionIndex: sectionData.indexOf(closest),
            itemIndex: 0,
        });
    }, [sectionData, date]);

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && !!sectionData.length && (
                <SectionList
                    sections={sectionData}
                    ref={listRef}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise((resolve) =>
                            setTimeout(resolve, 100),
                        );
                        wait.then(() => {
                            listRef.current?.scrollToLocation({
                                sectionIndex: info.index,
                                itemIndex: 0,
                                animated: false,
                            });
                        });
                    }}
                    onLayout={scrollToCurrentSection}
                    getItemLayout={buildGetItemLayout}
                    renderSectionHeader={({ section }) => (
                        <BlurView
                            intensity={100}
                            tint={
                                scheme === "light"
                                    ? "systemMaterialLight"
                                    : "systemMaterialDark"
                            }
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "flex-end",
                                height: SECTION_HEADER_HEIGHT,
                                paddingHorizontal: theme.padding.pageHorizontal,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.color.border,
                            }}
                        >
                            <Text
                                variant="title"
                                style={{ paddingTop: theme.padding.small }}
                            >
                                {section.showMonth &&
                                    section.date.toLocaleString("default", {
                                        month: "long",
                                    })}
                            </Text>
                            <Text variant="display">{section.yearTitle}</Text>
                        </BlurView>
                    )}
                    stickySectionHeadersEnabled
                    renderItem={({ item, section }) => (
                        <PosterCard
                            title={item.mediaTitle}
                            imageUri={item.mediaPosterUri}
                            releaseDate={
                                item.mediaReleaseDate
                                    ? new Date(
                                          item.mediaReleaseDate,
                                      ).toLocaleDateString("en-AU", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year:
                                              section.yearTitle === "Older"
                                                  ? "numeric"
                                                  : undefined,
                                      })
                                    : undefined
                            }
                            onPress={() =>
                                router.push({
                                    pathname: "/movies/movie",
                                    params: {
                                        mediaId: item.mediaId,
                                        mediaTitle: item.mediaTitle,
                                        mediaPosterUri: item.mediaPosterUri,
                                    },
                                })
                            }
                            height={ITEM_HEIGHT}
                        />
                    )}
                    renderSectionFooter={() => (
                        <View style={{ height: SECTION_FOOTER_HEIGHT }} />
                    )}
                    keyExtractor={(item) => item.mediaId.toString()}
                    contentInsetAdjustmentBehavior="automatic"
                    contentInset={{ top: HEADER_HEIGHT }}
                    contentContainerStyle={styles.container}
                />
            )}
        </>
    );
};

const createStyles = ({ theme: { padding, color } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingBottom: padding.large,
            backgroundColor: color.background,
        },
    });

export default Watchlist;
