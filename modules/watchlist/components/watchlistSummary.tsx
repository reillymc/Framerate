import { AnimatedFlatList } from "@/components/animatedFlatList";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
import type React from "react";
import { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
    Layout,
    useAnimatedScrollHandler,
    useSharedValue,
    ZoomInRight,
    ZoomOutRight,
} from "react-native-reanimated";
import { WatchListEntrySummaryItem } from "./watchlistSummaryItem";

interface WatchlistSummaryProps {
    watchlistEntries: WatchlistEntrySummary[];
    onPressEntry: (item: WatchlistEntrySummary) => void;
}

const watchlistEntryItemWidth = 100;
const watchlistEntryItemHeight = 150;

export const WatchlistSummary: React.FunctionComponent<
    WatchlistSummaryProps
> = ({ watchlistEntries, onPressEntry }) => {
    const { width } = useWindowDimensions();

    const scrollValue = useSharedValue(0);
    const styles = useThemedStyles(createStyles, { width });

    const handler = useAnimatedScrollHandler((event) => {
        scrollValue.value = event.contentOffset.x;
    });

    const filteredItems = useMemo(
        () =>
            watchlistEntries.filter(
                (item) =>
                    item.mediaReleaseDate &&
                    isWithinInterval(new Date(item.mediaReleaseDate), {
                        start: subWeeks(new Date(), 6),
                        end: addWeeks(new Date(), 1),
                    }),
            ),
        [watchlistEntries],
    );

    return (
        <Animated.View
            entering={ZoomInRight.springify().mass(0.55)}
            layout={Layout}
            exiting={ZoomOutRight.springify().mass(0.55)}
        >
            <AnimatedFlatList
                data={filteredItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                onScroll={handler}
                snapToInterval={watchlistEntryItemWidth}
                snapToAlignment="start"
                scrollEventThrottle={16}
                decelerationRate={0}
                keyExtractor={(item) => item.mediaId}
                cellStyle={({ index }) => ({
                    zIndex: filteredItems.length - index,
                })}
                contentContainerStyle={{ paddingLeft: 200 }}
                renderItem={({ item, index }) => {
                    return (
                        <WatchListEntrySummaryItem
                            item={item}
                            index={index}
                            key={item.mediaId}
                            scrollValue={scrollValue}
                            width={watchlistEntryItemWidth}
                            height={watchlistEntryItemHeight}
                            onPress={() => onPressEntry(item)}
                        />
                    );
                }}
            />
        </Animated.View>
    );
};

WatchlistSummary.displayName = "WatchlistSummary";

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingBottom: padding.large,
        },
    });
