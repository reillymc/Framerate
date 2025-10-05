import { type FC, useCallback, useMemo, useRef } from "react";
import {
    Platform,
    SectionList,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
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

import { Fade, PosterCard, usePosterDimensions } from "@/components";
import { displayFullNumeric } from "@/helpers/dateHelper";
import { getItemLayout } from "@/helpers/getItemLayout";
import { useColorScheme } from "@/hooks";

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
    const listRef = useRef<SectionList<MovieWatchlistEntry> | null>(null);
    const scheme = useColorScheme();
    const { width } = useWindowDimensions();
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
                    height={height + theme.spacing.large}
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
                        style={styles.headerFade}
                        color={theme.color.background}
                    />
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
    { theme: { spacing, color } }: ThemedStyles,
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
        headerFade: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
        },
    });
