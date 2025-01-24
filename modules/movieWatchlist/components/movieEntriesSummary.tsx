import { Fade, type PosterProperties } from "@/components";
import {
    AnimatedFlatList,
    type AnimatedFlatListProps,
} from "@/components/animatedFlatList";
import {
    Icon,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import {
    addMonths,
    endOfMonth,
    isWithinInterval,
    startOfMonth,
    subDays,
    subMonths,
} from "date-fns";
import { DeviceType, deviceType } from "expo-device";
import { type FC, useCallback, useMemo, useRef } from "react";
import {
    type CellRendererProps,
    type FlatList,
    type ListRenderItem,
    Pressable,
    StyleSheet,
    useWindowDimensions,
} from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    type StyleProps,
} from "react-native-reanimated";
import { MovieEntryConstants } from "../constants";
import type { MovieWatchlistEntry } from "../models";
import { MovieEntryStackedPoster } from "./movieEntryStackedPoster";

const keyExtractor: AnimatedFlatListProps<MovieWatchlistEntry>["keyExtractor"] =
    (item) => item.movieId.toString();

interface MovieEntriesSummaryProps {
    watchlistEntries: MovieWatchlistEntry[];
    posterProperties: PosterProperties;
    onPressEntry: (item: MovieWatchlistEntry) => void;
    onRemoveFromWatchlist: (item: MovieWatchlistEntry) => void;
    onAddReview: (item: MovieWatchlistEntry) => void;
    onPress: (date?: Date) => void;
}

export const MovieEntriesSummary: FC<MovieEntriesSummaryProps> = ({
    watchlistEntries,
    posterProperties,
    onPressEntry,
    onPress,
    onAddReview,
    onRemoveFromWatchlist,
}) => {
    const scrollValue = useSharedValue(0);
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<FlatList | null>(null);
    const { width } = useWindowDimensions();

    const scrollHandler = useAnimatedScrollHandler((event) => {
        scrollValue.value = event.contentOffset.x;
    });

    const filteredItems = useMemo(() => {
        const entriesInterval = {
            start: startOfMonth(
                subMonths(new Date(), MovieEntryConstants.monthsBack),
            ),
            end: endOfMonth(
                addMonths(new Date(), MovieEntryConstants.monthsAhead),
            ),
        };

        return watchlistEntries.filter(
            (item) =>
                item.releaseDate &&
                isWithinInterval(new Date(item.releaseDate), entriesInterval),
        );
    }, [watchlistEntries]);

    const scrollToCurrentSection = useCallback(() => {
        if (!(listRef.current && filteredItems.length)) return;
        const closest = filteredItems.toReversed().findIndex(
            (item) =>
                item.releaseDate &&
                // Allow time for current movie to be presented so that it is not immediately overtaken by the next release
                new Date(item.releaseDate) >= subDays(new Date(), 7),
        );

        const index = closest === -1 ? 0 : filteredItems.length - closest - 1;

        listRef.current.scrollToIndex({
            animated: false,
            index: Math.max(0, index),
        });
    }, [filteredItems]);

    const renderItem: ListRenderItem<MovieWatchlistEntry> = useCallback(
        ({ item, index }) => (
            <MovieEntryStackedPoster
                index={index}
                posterProperties={posterProperties}
                posterPath={item.posterPath}
                scrollValue={scrollValue}
                onPress={() => onPressEntry(item)}
                onAddReview={() => onAddReview(item)}
                onRemoveFromWatchlist={() => onRemoveFromWatchlist(item)}
            />
        ),
        [
            posterProperties,
            scrollValue,
            onPressEntry,
            onAddReview,
            onRemoveFromWatchlist,
        ],
    );

    const onScrollToIndexFailed: AnimatedFlatListProps<MovieWatchlistEntry>["onScrollToIndexFailed"] =
        useCallback(({ index }: { index: number }) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 10));
            wait.then(() => {
                listRef.current?.scrollToIndex({
                    index: index,
                    animated: false,
                });
            });
        }, []);

    const getItemLayout: AnimatedFlatListProps<MovieWatchlistEntry>["getItemLayout"] =
        useCallback(
            (_: unknown, index: number) => ({
                index,
                length: posterProperties.width,
                offset: posterProperties.width * index,
            }),
            [posterProperties.width],
        );

    const cellStyle = useCallback(
        ({ index }: CellRendererProps<MovieWatchlistEntry>): StyleProps => ({
            zIndex: filteredItems.length - index,
        }),
        [filteredItems.length],
    );

    return (
        <>
            <AnimatedFlatList
                ref={listRef}
                data={filteredItems}
                horizontal
                onLayout={scrollToCurrentSection}
                onScrollToIndexFailed={onScrollToIndexFailed}
                getItemLayout={getItemLayout}
                showsHorizontalScrollIndicator={false}
                style={[
                    styles.list,
                    deviceType === DeviceType.TABLET
                        ? { paddingLeft: "36%" }
                        : undefined,
                ]}
                onScroll={scrollHandler}
                snapToInterval={posterProperties.width}
                snapToAlignment="start"
                scrollEventThrottle={16}
                decelerationRate={0}
                keyExtractor={keyExtractor}
                cellStyle={cellStyle}
                contentContainerStyle={styles.listContent}
                renderItem={renderItem}
                ListFooterComponent={
                    filteredItems.length > 1 ? (
                        <Animated.View>
                            <Pressable
                                style={[
                                    styles.footerContainer,
                                    {
                                        height: posterProperties.height,
                                        width: width / 7.3,
                                    },
                                ]}
                                onPress={() =>
                                    onPress(
                                        startOfMonth(
                                            subMonths(
                                                startOfMonth(new Date()),
                                                MovieEntryConstants.monthsBack,
                                            ),
                                        ),
                                    )
                                }
                            >
                                <Icon set="octicons" iconName="arrow-right" />
                                <Text variant="bodyEmphasized">Older</Text>
                            </Pressable>
                        </Animated.View>
                    ) : undefined
                }
                ListEmptyComponent={
                    <Pressable
                        style={styles.placeholderContainer}
                        onPress={() => onPress()}
                    >
                        <Text variant="caption">No upcoming releases</Text>
                        <Text variant="caption">
                            {`${watchlistEntries.length} movie${watchlistEntries.length === 1 ? "" : "s"} on watchlist`}
                        </Text>
                    </Pressable>
                }
                scrollEnabled={filteredItems.length > 0}
            />
            <Fade
                direction="left"
                width={16}
                height={posterProperties.height}
                fadeOffset={12}
                style={{ position: "absolute", bottom: 0, top: 0, right: 0 }}
            />
        </>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingBottom: spacing.large,
            paddingTop: spacing.tiny,
        },
        listContent: {
            paddingLeft: spacing.pageHorizontal,
        },
        placeholderContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: spacing.large,
            gap: spacing.medium,
        },
        footerContainer: {
            flex: 1,
            paddingRight: spacing.small,
            justifyContent: "center",
            alignItems: "center",
        },
    });
