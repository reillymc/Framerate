import { usePosterDimensions } from "@/components";
import {
    AnimatedFlatList,
    type AnimatedFlatListProps,
} from "@/components/animatedFlatList";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    Icon,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { addMonths, isWithinInterval, subMonths } from "date-fns";
import { type FC, useCallback, useMemo, useRef } from "react";
import {
    type FlatList,
    Pressable,
    type StyleProp,
    StyleSheet,
    type ViewStyle,
} from "react-native";
import Animated, {
    LinearTransition,
    useAnimatedScrollHandler,
    useSharedValue,
    ZoomInLeft,
    ZoomOutLeft,
} from "react-native-reanimated";
import { WatchListEntrySummaryItem } from "./watchlistSummaryItem";

interface WatchlistSummaryProps {
    watchlistEntries: WatchlistEntrySummary[];
    style?: StyleProp<ViewStyle>;
    onPressEntry: (item: WatchlistEntrySummary) => void;
    onRemoveFromWatchlist: (item: WatchlistEntrySummary) => void;
    onAddReview: (item: WatchlistEntrySummary) => void;
    onPress: (destination?: "older") => void;
}

export const WatchlistSummary: FC<WatchlistSummaryProps> = ({
    watchlistEntries,
    style,
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

    const filteredItems = useMemo(
        () =>
            watchlistEntries.filter(
                (item) =>
                    item.mediaReleaseDate &&
                    isWithinInterval(new Date(item.mediaReleaseDate), {
                        start: subMonths(new Date(), 2),
                        end: addMonths(new Date(), 4),
                    }),
            ),
        [watchlistEntries],
    );

    const now = new Date();

    const scrollToCurrentSection = useCallback(() => {
        if (!listRef.current) return;

        const closest = filteredItems
            .toReversed()
            .findIndex(
                (item) =>
                    item.mediaReleaseDate &&
                    new Date(item.mediaReleaseDate) >= now,
            );

        const index = closest === -1 ? 0 : filteredItems.length - closest - 1;

        listRef.current.scrollToIndex({
            animated: false,
            index: Math.max(0, index),
        });
    }, [filteredItems, now]);

    const keyExtractor: AnimatedFlatListProps<WatchlistEntrySummary>["keyExtractor"] =
        (item) => item.mediaId.toString();

    const renderItem: AnimatedFlatListProps<WatchlistEntrySummary>["renderItem"] =
        ({ item, index }) => (
            <WatchListEntrySummaryItem
                mediaPosterUri={item.mediaPosterUri}
                index={index}
                scrollValue={scrollValue}
                onPress={() => onPressEntry(item)}
                onAddReview={() => onAddReview(item)}
                onRemoveFromWatchlist={() => onRemoveFromWatchlist(item)}
            />
        );

    const onScrollToIndexFailed: AnimatedFlatListProps<WatchlistEntrySummary>["onScrollToIndexFailed"] =
        ({ index }) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 10));
            wait.then(() => {
                listRef.current?.scrollToIndex({
                    index: index,
                    animated: false,
                });
            });
        };

    const getItemLayout: AnimatedFlatListProps<WatchlistEntrySummary>["getItemLayout"] =
        (_, index) => ({
            index,
            length: width,
            offset: width * index,
        });

    const cellStyle: AnimatedFlatListProps<WatchlistEntrySummary>["cellStyle"] =
        ({ index }) => ({
            zIndex: filteredItems.length - index,
        });

    return (
        <Animated.View
            entering={ZoomInLeft.springify().mass(0.55)}
            exiting={ZoomOutLeft.springify().mass(0.55)}
            layout={LinearTransition}
            style={style}
        >
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
                                onPress={() => onPress("older")}
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
        </Animated.View>
    );
};

WatchlistSummary.displayName = "WatchlistSummary";

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
