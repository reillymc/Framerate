import { PosterCard } from "@/components";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks/useColorScheme";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { BlurView } from "expo-blur";
import { type FC, useCallback, useMemo, useRef } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { getGroupedEntries } from "../helpers";

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

interface SectionedWatchlistProps {
    entries: WatchlistEntrySummary[];
    jumpToDate?: Date;
    onRefresh: () => void;
    onPressEntry: (item: WatchlistEntrySummary) => void;
    onDeleteEntry: (mediaId: number) => void;
}

export const SectionedWatchlist: FC<SectionedWatchlistProps> = ({
    entries,
    jumpToDate,
    onRefresh,
    onDeleteEntry,
    onPressEntry,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<SectionList<WatchlistEntrySummary> | null>(null);
    const scheme = useColorScheme();

    const sectionData = useMemo(() => getGroupedEntries(entries), [entries]);

    const scrollToCurrentSection = useCallback(() => {
        if (!(listRef.current && sectionData.length)) return;

        const sectionCount = sectionData.length - 1;

        const closest =
            sectionCount -
            sectionData
                .toReversed()
                .findIndex((section) => section.date >= (jumpToDate ?? now));

        listRef.current.scrollToLocation({
            animated: false,
            sectionIndex: closest > sectionCount ? 0 : closest,
            itemIndex: 0,
        });
    }, [sectionData, jumpToDate]);
    if (!sectionData.length) return null;

    return (
        <SectionList
            sections={sectionData}
            ref={listRef}
            refreshing={false}
            onRefresh={onRefresh}
            onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 100));
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
                    onPress={() => onPressEntry(item)}
                    onToggleWatchlist={() => onDeleteEntry(item.mediaId)}
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
    );
};

SectionedWatchlist.displayName = "SectionedWatchlist";

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
