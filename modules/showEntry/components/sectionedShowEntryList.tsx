import { Fade, PosterCard } from "@/components";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ActiveStatuses } from "@/modules/show";
import {
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { BlurView } from "expo-blur";
import { type FC, useCallback, useMemo, useRef } from "react";
import {
    SectionList,
    type SectionListData,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import type { ShowEntry } from "../models";

const HEADER_HEIGHT = 96;
const ITEM_HEIGHT = 92;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

const buildGetItemLayout = getItemLayout<ShowEntry>({
    getItemHeight: ITEM_HEIGHT,
    getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
    getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
});

interface SectionedShowEntryListProps {
    entries: ShowEntry[];
    onRefresh: () => void;
    onPressEntry: (item: ShowEntry) => void;
    onDeleteEntry: (showId: number) => void;
}

export const SectionedShowEntryList: FC<SectionedShowEntryListProps> = ({
    entries,
    onDeleteEntry,
    onPressEntry,
    onRefresh,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<SectionList<ShowEntry> | null>(null);
    const scheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

    const sectionData: Array<SectionListData<ShowEntry, unknown>> =
        useMemo(() => {
            const endedShows = entries.filter(
                ({ status, nextAirDate }) =>
                    (status === undefined ||
                        !ActiveStatuses.includes(status)) &&
                    nextAirDate === undefined,
            );

            const nonEndedShows = entries.filter(
                (show) => !endedShows.includes(show),
            );

            const currentShows = nonEndedShows.filter(
                ({ nextAirDate }) => nextAirDate !== undefined,
            );

            const upcomingShows = nonEndedShows.filter(
                ({ nextAirDate }) => nextAirDate === undefined,
            );

            return [
                {
                    data: upcomingShows,
                    title: "Upcoming",
                    renderItem: ({ item }) => (
                        <PosterCard
                            heading={item.name}
                            imageUri={item.posterPath}
                            releaseDate={item.nextAirDate}
                            onWatchlist
                            onToggleWatchlist={() => onDeleteEntry(item.showId)}
                            onPress={() => onPressEntry(item)}
                        />
                    ),
                },
                {
                    data: currentShows,
                    title: "Current",
                    renderItem: ({ item }) => (
                        <PosterCard
                            heading={item.name}
                            imageUri={item.posterPath}
                            releaseDate={item.nextAirDate}
                            onWatchlist
                            onToggleWatchlist={() => onDeleteEntry(item.showId)}
                            onPress={() => onPressEntry(item)}
                        />
                    ),
                },
                {
                    data: endedShows,
                    title: "Concluded",
                    renderItem: ({ item }) => (
                        <PosterCard
                            heading={item.name}
                            imageUri={item.posterPath}
                            releaseDate={item.status}
                            onWatchlist
                            onToggleWatchlist={() => onDeleteEntry(item.showId)}
                            onPress={() => onPressEntry(item)}
                        />
                    ),
                },
            ];
        }, [entries, onPressEntry, onDeleteEntry]);

    const scrollToCurrentSection = useCallback(() => {
        if (!(listRef.current && sectionData.length)) return;
        listRef.current.scrollToLocation({
            animated: false,
            sectionIndex: 1,
            itemIndex: 0,
        });
    }, [sectionData]);

    return (
        <SectionList
            sections={sectionData}
            ref={listRef}
            stickySectionHeadersEnabled
            keyExtractor={(item) => item.showId.toString()}
            contentInsetAdjustmentBehavior="automatic"
            contentInset={{ top: HEADER_HEIGHT }}
            contentContainerStyle={styles.container}
            getItemLayout={buildGetItemLayout}
            onLayout={scrollToCurrentSection}
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
            renderSectionHeader={({ section }) => (
                <BlurView
                    intensity={scheme === "light" ? 90 : 40}
                    tint={
                        scheme === "light"
                            ? "systemMaterialLight"
                            : "systemThickMaterialDark"
                    }
                    style={styles.sectionHeaderContainer}
                >
                    <Text variant="title">{section.title}</Text>
                    <Text variant="display" style={styles.yearHeading}>
                        {section.yearTitle}
                    </Text>
                </BlurView>
            )}
            renderSectionFooter={() => (
                <View style={{ height: SECTION_FOOTER_HEIGHT }} />
            )}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text
                        variant="body"
                        style={styles.header}
                    >{`${entries.length} items on watchlist`}</Text>
                    <BlurView
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 45,
                        }}
                        intensity={scheme === "light" ? 90 : 40}
                        tint={
                            scheme === "light"
                                ? "systemMaterialLight"
                                : "systemThickMaterialDark"
                        }
                    />
                    <Fade
                        direction="down"
                        fadeOffset={0}
                        height={45}
                        width={width}
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                        color={theme.color.background}
                    />
                </View>
            }
        />
    );
};

const createStyles = ({ theme: { padding, color } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingBottom: padding.large,
            backgroundColor: color.background,
        },
        sectionHeaderContainer: {
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
        headerContainer: {
            marginTop: -HEADER_HEIGHT,
            height: HEADER_HEIGHT,
        },
        header: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.large,
        },
    });
