import { Fade, PosterCard } from "@/components";
import { displayFullNumeric } from "@/helpers/dateHelper";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks/useColorScheme";
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
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import { getGroupedEntries } from "../helpers";
import type { MovieWatchlistEntry } from "../models";

const HEADER_HEIGHT = 96;
const ITEM_HEIGHT = 92;
const SECTION_HEADER_HEIGHT = 44;
const SECTION_FOOTER_HEIGHT = 32;

const buildGetItemLayout = getItemLayout<MovieWatchlistEntry>({
    getItemHeight: ITEM_HEIGHT,
    getSectionHeaderHeight: SECTION_HEADER_HEIGHT,
    getSectionFooterHeight: SECTION_FOOTER_HEIGHT,
});

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

const formatItemDate = (rawDate: Date | undefined, isOlder?: boolean) => {
    if (!rawDate) return "Unknown";

    const date = new Date(rawDate);

    if (isOlder) {
        return displayFullNumeric(date);
    }

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
    onRefresh: () => void;
    onPressEntry: (item: MovieWatchlistEntry) => void;
    onDeleteEntry: (movieId: number) => void;
    onAddReview: (movieId: number) => void;
}

export const SectionedMovieEntryList: FC<SectionedMovieEntryListProps> = ({
    entries,
    jumpToDate,
    onRefresh,
    onDeleteEntry,
    onPressEntry,
    onAddReview,
}) => {
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<SectionList<MovieWatchlistEntry> | null>(null);
    const scheme = useColorScheme();
    const { width } = useWindowDimensions();
    const { theme } = useTheme();

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
            getItemLayout={buildGetItemLayout}
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
                    <Text variant="title">{section.monthTitle}</Text>
                    <Text variant="display" style={styles.yearHeading}>
                        {section.yearTitle}
                    </Text>
                </BlurView>
            )}
            stickySectionHeadersEnabled
            renderItem={({ item, section }) => (
                <PosterCard
                    heading={item.title}
                    imageUri={item.posterPath}
                    onWatchlist
                    subHeading={formatItemDate(
                        item.releaseDate,
                        section.yearTitle === "Older",
                    )}
                    onPress={() => onPressEntry(item)}
                    onToggleWatchlist={() => onDeleteEntry(item.movieId)}
                    onAddReview={() => onAddReview(item.movieId)}
                    height={ITEM_HEIGHT}
                />
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
            keyExtractor={(item) => item.movieId.toString()}
            contentInsetAdjustmentBehavior="automatic"
            contentInset={{ top: HEADER_HEIGHT }}
            contentContainerStyle={styles.container}
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
