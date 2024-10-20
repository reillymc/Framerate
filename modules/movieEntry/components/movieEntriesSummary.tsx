import { Fade, usePosterDimensions } from "@/components";
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
import { type FC, useCallback, useMemo, useRef } from "react";
import { type FlatList, Pressable, StyleSheet } from "react-native";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import { MovieEntryConstants } from "../constants";
import type { MovieEntry } from "../models";
import { MovieEntryStackedPoster } from "./movieEntryStackedPoster";

interface MovieEntriesSummaryProps {
    watchlistEntries: MovieEntry[];
    onPressEntry: (item: MovieEntry) => void;
    onRemoveFromWatchlist: (item: MovieEntry) => void;
    onAddReview: (item: MovieEntry) => void;
    onPress: (date?: Date) => void;
}

export const MovieEntriesSummary: FC<MovieEntriesSummaryProps> = ({
    watchlistEntries,
    onPressEntry,
    onPress,
    onAddReview,
    onRemoveFromWatchlist,
}) => {
    const { width, height, gap } = usePosterDimensions({ size: "small" });

    const scrollValue = useSharedValue(0);
    const styles = useThemedStyles(createStyles, {});
    const listRef = useRef<FlatList | null>(null);

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

    const keyExtractor: AnimatedFlatListProps<MovieEntry>["keyExtractor"] = (
        item,
    ) => item.movieId.toString();

    const renderItem: AnimatedFlatListProps<MovieEntry>["renderItem"] = ({
        item,
        index,
    }) => (
        <MovieEntryStackedPoster
            index={index}
            posterPath={item.posterPath}
            scrollValue={scrollValue}
            onPress={() => onPressEntry(item)}
            onAddReview={() => onAddReview(item)}
            onRemoveFromWatchlist={() => onRemoveFromWatchlist(item)}
        />
    );

    const onScrollToIndexFailed: AnimatedFlatListProps<MovieEntry>["onScrollToIndexFailed"] =
        ({ index }) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 10));
            wait.then(() => {
                listRef.current?.scrollToIndex({
                    index: index,
                    animated: false,
                });
            });
        };

    const getItemLayout: AnimatedFlatListProps<MovieEntry>["getItemLayout"] = (
        _,
        index,
    ) => ({
        index,
        length: width,
        offset: width * index,
    });

    const cellStyle: AnimatedFlatListProps<MovieEntry>["cellStyle"] = ({
        index,
    }) => ({
        zIndex: filteredItems.length - index,
    });

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
                style={styles.list}
                onScroll={scrollHandler}
                snapToInterval={width}
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
                                    { height, width: width / 2 + gap },
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
                height={height}
                fadeOffset={12}
                style={{ position: "absolute", bottom: 0, top: 0, right: 0 }}
            />
        </>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingBottom: padding.large,
            paddingTop: padding.tiny,
        },
        listContent: {
            paddingLeft: padding.pageHorizontal,
        },
        placeholderContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: padding.large,
            gap: padding.regular,
        },
        footerContainer: {
            flex: 1,
            paddingRight: padding.small,
            justifyContent: "center",
            alignItems: "center",
        },
    });
