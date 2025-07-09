import { type FC, useCallback, useMemo, useRef } from "react";
import {
    Platform,
    SectionList,
    type SectionListData,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Octicons } from "@expo/vector-icons";
import { Undefined } from "@reillymc/es-utils";
import {
    SwipeAction,
    SwipeableContainer,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { addMonths, isBefore } from "date-fns";

import { ActiveStatuses, type ShowStatus } from "@/modules/show";

import { Fade, PosterCard, usePosterDimensions } from "@/components";
import { displayFull, displayWithWeek } from "@/helpers/dateHelper";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks";

import { ShowEntryConstants } from "../../showWatchlist/constants";
import { SortEntriesByLastAirDate, SortEntriesByNextAirDate } from "../helpers";
import type { ShowWatchlistEntry } from "../models";

const HEADER_HEIGHT = 38;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

interface SectionedShowEntryListProps {
    entries: ShowWatchlistEntry[];
    onRefresh: () => void;
    onPressEntry: (item: ShowWatchlistEntry) => void;
    onDeleteEntry: (showId: number) => void;
    onAddReview: (showId: number) => void;
}

type ShowEntrySection = SectionListData<ShowWatchlistEntry, { title?: string }>;

export const SectionedShowEntryList: FC<SectionedShowEntryListProps> = ({
    entries,
    onDeleteEntry,
    onPressEntry,
    onAddReview,
    onRefresh,
}) => {
    const listRef = useRef<SectionList<ShowWatchlistEntry> | null>(null);
    const scheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { top } = useSafeAreaInsets();
    const { theme } = useTheme();
    const { height } = usePosterDimensions({ size: "tiny" });

    const styles = useThemedStyles(createStyles, { top });

    const itemHeight = useMemo(
        () => height + theme.spacing.large,
        [height, theme.spacing.large],
    );

    const getItemHeight = useMemo(() => {
        return getItemLayout<ShowWatchlistEntry>({
            getItemHeight: itemHeight,
            getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
            getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
        });
    }, [itemHeight]);

    const sectionData: Array<ShowEntrySection> = useMemo(() => {
        const currentlyAiringCutOff = addMonths(
            new Date(),
            ShowEntryConstants.currentMonthsAhead,
        );

        const endedShows = entries
            .filter(
                ({ status, nextAirDate }) =>
                    (status === undefined ||
                        !ActiveStatuses.includes(status as ShowStatus)) &&
                    nextAirDate === undefined,
            )
            .sort(SortEntriesByLastAirDate);

        const nonEndedShows = entries.filter(
            (show) => !endedShows.includes(show),
        );

        const currentShows = nonEndedShows
            .filter(
                ({ nextAirDate }) =>
                    nextAirDate !== undefined &&
                    isBefore(nextAirDate, currentlyAiringCutOff),
            )
            .sort(SortEntriesByNextAirDate);

        const upcomingShows = nonEndedShows
            .filter(
                ({ nextAirDate }) =>
                    nextAirDate === undefined ||
                    !isBefore(nextAirDate, currentlyAiringCutOff),
            )
            .sort(SortEntriesByNextAirDate);

        return [
            upcomingShows.length
                ? ({
                      data: upcomingShows,
                      title: "Upcoming",
                      renderItem: ({ item }) => (
                          <PosterCard
                              heading={item.name}
                              imageUri={item.posterPath}
                              subHeading={displayFull(item.nextAirDate)}
                              onWatchlist
                              onToggleWatchlist={() =>
                                  onDeleteEntry(item.showId)
                              }
                              onAddReview={() => onAddReview(item.showId)}
                              onPress={() => onPressEntry(item)}
                              height={itemHeight}
                          />
                      ),
                  } satisfies ShowEntrySection)
                : undefined,
            currentShows.length
                ? ({
                      data: currentShows,
                      title: "Current",
                      renderItem: ({ item }) => (
                          <PosterCard
                              heading={item.name}
                              imageUri={item.posterPath}
                              subHeading={displayWithWeek(item.nextAirDate)}
                              onWatchlist
                              onToggleWatchlist={() =>
                                  onDeleteEntry(item.showId)
                              }
                              onAddReview={() => onAddReview(item.showId)}
                              onPress={() => onPressEntry(item)}
                              height={itemHeight}
                          />
                      ),
                  } satisfies ShowEntrySection)
                : undefined,
            endedShows.length
                ? ({
                      data: endedShows,
                      title: "Concluded",
                      renderItem: ({ item }) => (
                          <PosterCard
                              heading={item.name}
                              imageUri={item.posterPath}
                              subHeading={item.status}
                              onWatchlist
                              onToggleWatchlist={() =>
                                  onDeleteEntry(item.showId)
                              }
                              onAddReview={() => onAddReview(item.showId)}
                              onPress={() => onPressEntry(item)}
                              height={itemHeight}
                          />
                      ),
                  } satisfies ShowEntrySection)
                : undefined,
        ].filter(Undefined);
    }, [entries, itemHeight, onPressEntry, onDeleteEntry, onAddReview]);

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
            contentInset={
                Platform.OS === "ios" ? { top: top + HEADER_HEIGHT } : undefined
            }
            contentContainerStyle={styles.container}
            getItemLayout={getItemHeight}
            onLayout={scrollToCurrentSection}
            refreshing={false}
            onRefresh={onRefresh}
            CellRendererComponent={({ item, children }) => (
                <SwipeableContainer
                    rightActions={[
                        <SwipeAction
                            iconSet={Octicons}
                            key="delete"
                            iconName="dash"
                            onPress={() => {
                                onDeleteEntry(item.showId);
                            }}
                            variant="destructive"
                        />,
                    ]}
                >
                    {children}
                </SwipeableContainer>
            )}
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
                    >{`${entries.length} shows on watchlist`}</Text>
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

const createStyles = (
    { theme: { spacing, color, border } }: ThemedStyles,
    { top }: { top: number },
) =>
    StyleSheet.create({
        container: {
            paddingBottom: spacing.large,
            backgroundColor: color.background,
        },
        sectionHeaderContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: SECTION_HEADER_HEIGHT,
            paddingHorizontal: spacing.pageHorizontal,
            borderBottomWidth: border.width.thin,
            borderBottomColor: color.border,
            backgroundColor:
                Platform.OS === "android" ? color.foreground : undefined,
        },
        yearHeading: {
            paddingBottom: 2,
        },
        headerContainer: {
            marginTop: -(top + HEADER_HEIGHT),
            height: top + HEADER_HEIGHT,
        },
        header: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.large,
        },
    });
