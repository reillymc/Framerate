import { PosterCard } from "@/components";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks";
import { getGroupedEntries, useWatchlist } from "@/modules/watchlist";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntries,
} from "@/modules/watchlistEntry";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useCallback, useMemo, useRef } from "react";
import { SectionList, StyleSheet, View } from "react-native";

const HEADER_HEIGHT = 96;
const ITEM_HEIGHT = 92;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

const buildGetItemLayout = getItemLayout<WatchlistEntrySummary>({
    getItemHeight: ITEM_HEIGHT,
    getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
    getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
});

const now = new Date();

const Watchlist: FC = () => {
    const {
        mediaType,
        date: rawDate,
        destination,
    } = useLocalSearchParams<{
        mediaType: string;
        date?: string;
        destination?: "older";
    }>();

    const date = rawDate ? new Date(rawDate) : undefined;

    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<SectionList<WatchlistEntrySummary> | null>(null);
    const scheme = useColorScheme();

    const { data: watchlist } = useWatchlist(mediaType);
    const {
        data: entries = [],
        isLoading,
        refetch,
    } = useWatchlistEntries(mediaType);
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    const sectionData = useMemo(() => getGroupedEntries(entries), [entries]);

    const scrollToCurrentSection = useCallback(() => {
        if (!(listRef.current && sectionData.length)) return;

        const sectionCount = sectionData.length - 1;

        const closest =
            destination === "older"
                ? sectionCount
                : sectionCount -
                  sectionData
                      .toReversed()
                      .findIndex((section) => section.date >= (date ?? now));

        listRef.current.scrollToLocation({
            animated: false,
            sectionIndex: closest > sectionCount ? 0 : closest,
            itemIndex: 0,
        });
    }, [sectionData, date, destination]);

    return (
        <>
            <Stack.Screen options={{ title: watchlist?.name ?? "..." }} />
            {!isLoading && !!sectionData.length && (
                <SectionList
                    sections={sectionData}
                    ref={listRef}
                    refreshing={false}
                    onRefresh={refetch}
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
                            style={styles.headerContainer}
                        >
                            <Text variant="title">{section.monthTitle}</Text>
                            <Text variant="display" style={styles.yearHeading}>
                                {section.yearTitle}
                            </Text>
                        </BlurView>
                    )}
                    stickySectionHeadersEnabled
                    renderItem={({ item, section }) => (
                        <PosterCard
                            heading={item.mediaTitle}
                            imageUri={item.mediaPosterUri}
                            onWatchlist
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
                                    : "Unknown"
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
                            onToggleWatchlist={() =>
                                deleteWatchlistEntry({
                                    mediaId: item.mediaId,
                                    mediaType,
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
        headerContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: SECTION_HEADER_HEIGHT,
            paddingHorizontal: padding.pageHorizontal,
            borderBottomWidth: 1,
            borderBottomColor: color.border,
        },
        yearHeading: {
            paddingBottom: 2,
        },
    });

export default Watchlist;
