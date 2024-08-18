import { usePosterDimensions } from "@/components";
import { AnimatedFlatList } from "@/components/animatedFlatList";
import type { WatchlistEntrySummary } from "@/modules/watchlistEntry/services";
import {
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { addWeeks, isWithinInterval, subWeeks } from "date-fns";
import { type FC, useMemo } from "react";
import { type StyleProp, StyleSheet, type ViewStyle } from "react-native";
import Animated, {
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
}

export const WatchlistSummary: FC<WatchlistSummaryProps> = ({
    watchlistEntries,
    style,
    onPressEntry,
}) => {
    const { width } = usePosterDimensions({ size: "small" });

    const { theme } = useTheme();

    const scrollValue = useSharedValue(0);
    const styles = useThemedStyles(createStyles, {});

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
            entering={ZoomInLeft.springify().mass(0.55)}
            exiting={ZoomOutLeft.springify().mass(0.55)}
            style={style}
        >
            <AnimatedFlatList
                data={filteredItems}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                onScroll={handler}
                snapToInterval={width}
                snapToAlignment="start"
                scrollEventThrottle={16}
                decelerationRate={0}
                keyExtractor={({ mediaId }) => mediaId}
                cellStyle={({ index }) => ({
                    zIndex: filteredItems.length - index,
                })}
                contentContainerStyle={{
                    paddingLeft: theme.padding.pageHorizontal,
                }}
                renderItem={({ item, index }) => {
                    return (
                        <WatchListEntrySummaryItem
                            item={item}
                            index={index}
                            key={item.mediaId}
                            scrollValue={scrollValue}
                            onPress={() => onPressEntry(item)}
                        />
                    );
                }}
                ListFooterComponent={<Animated.View style={{ width: 50 }} />}
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
