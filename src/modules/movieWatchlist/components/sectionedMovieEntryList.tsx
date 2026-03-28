import {
    type FC,
    type ReactElement,
    type ReactNode,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Platform, SectionList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Octicons } from "@expo/vector-icons";
import {
    SwipeAction,
    SwipeableContainer,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { PosterCard } from "@/components";
import { displayFullNumeric } from "@/helpers/dateHelper";
import { getItemLayout } from "@/helpers/getItemLayout";
import { usePosterDimensions } from "@/hooks";

import { getGroupedEntries } from "../helpers";
import type { MovieWatchlistEntry } from "../models";

const HEADER_HEIGHT = 48;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

const now = new Date();

const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

const formatItemDate = (rawDate: string | undefined, isOlder?: boolean) => {
    if (!rawDate) return "Unknown";

    if (isOlder) {
        return displayFullNumeric(rawDate);
    }

    const date = new Date(rawDate);

    const dateString = date.toLocaleDateString("en-AU", {
        day: "2-digit",
        weekday: "long",
        month: undefined,
        year: undefined,
    });

    const ordinalSuffix = nthNumber(date.getDate());

    return `${dateString.replace(" ", ", ")}${ordinalSuffix}`;
};
interface SectionedMovieEntryListProps {
    entries: MovieWatchlistEntry[];
    jumpToDate?: Date;
    renderItem: (params: {
        item: MovieWatchlistEntry;
        children: ReactNode;
    }) => ReactElement;
    onRefresh: () => void;
    onDeleteEntry: (movieId: number) => void;
}

export const SectionedMovieEntryList: FC<SectionedMovieEntryListProps> = ({
    entries,
    jumpToDate,
    renderItem,
    onRefresh,
    onDeleteEntry,
}) => {
    const listRef = useRef<SectionList<MovieWatchlistEntry> | null>(null);
    const { top } = useSafeAreaInsets();
    const { theme } = useTheme();
    const { height } = usePosterDimensions({ size: "tiny" });

    const styles = useThemedStyles(createStyles, { top });

    const sectionData = useMemo(() => getGroupedEntries(entries), [entries]);

    const getItemHeight = useMemo(() => {
        return getItemLayout<MovieWatchlistEntry>({
            getItemHeight: height + theme.spacing.large,
            getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
            getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
        });
    }, [height, theme.spacing.large]);

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
            initialNumToRender={sectionData?.length} // Issue in FlatList: https://github.com/facebook/react-native/issues/36766#issuecomment-1853107471
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
            getItemLayout={getItemHeight}
            renderSectionHeader={({ section }) => (
                <BlurView
                    intensity={50}
                    tint="default"
                    style={styles.sectionHeaderContainer}
                >
                    <View style={styles.sectionHeaderInnerContainer} />
                    <Text variant="title" style={styles.monthHeading}>
                        {section.monthTitle}
                    </Text>
                    <Text variant="display" style={styles.yearHeading}>
                        {section.yearTitle}
                    </Text>
                </BlurView>
            )}
            stickySectionHeadersEnabled
            renderItem={({ item, section }) =>
                // TODO: refactor
                renderItem({
                    item,
                    children: (
                        <PosterCard
                            heading={item.title}
                            imageUri={item.posterPath}
                            subHeading={formatItemDate(
                                item.releaseDate,
                                section.yearTitle === "Older",
                            )}
                            asLink
                            height={height + theme.spacing.large}
                        />
                    ),
                })
            }
            renderSectionFooter={() => (
                <View style={{ height: SECTION_FOOTER_HEIGHT }} />
            )}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text
                        variant="body"
                        style={styles.header}
                    >{`${entries.length} items on watchlist`}</Text>
                </View>
            }
            CellRendererComponent={({ item, children }) => (
                <SwipeableContainer
                    rightActions={[
                        <SwipeAction
                            iconSet={Octicons}
                            key="delete"
                            iconName="dash"
                            onPress={() => {
                                onDeleteEntry(item.movieId);
                            }}
                            variant="destructive"
                        />,
                    ]}
                >
                    {children}
                </SwipeableContainer>
            )}
            keyExtractor={(item) => item.movieId.toString()}
            contentInsetAdjustmentBehavior="automatic"
            contentInset={
                Platform.OS === "ios" ? { top: top + HEADER_HEIGHT } : undefined
            }
            contentContainerStyle={styles.container}
        />
    );
};

const createStyles = (
    { theme: { spacing, color }, styles: { text } }: ThemedStyles,
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
            borderBottomWidth: 1,
            borderBottomColor: color.border,
            backgroundColor:
                Platform.OS === "android" ? color.foreground : undefined,
        },
        sectionHeaderInnerContainer: {
            ...StyleSheet.absoluteFill,
            backgroundColor: color.background,
            opacity: 0.9,
        },
        yearHeading: {
            lineHeight: text.font.display.size,
        },
        monthHeading: {
            lineHeight: text.font.display.size,
        },
        headerContainer: {
            marginTop: -(top + HEADER_HEIGHT),
        },
        header: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.large,
        },
        headerFade: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
