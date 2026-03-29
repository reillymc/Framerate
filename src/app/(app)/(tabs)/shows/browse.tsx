import type { FC } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { ScreenLayout } from "@/components";
import { Poster } from "@/components/poster";
import { usePosterDimensions } from "@/hooks";
import { usePopularShows } from "@/modules/show";
import {
    useDeleteShowWatchlistEntry,
    useSaveShowWatchlistEntry,
    useShowWatchlist,
} from "@/modules/showWatchlist";

const Browse: FC = () => {
    const router = useRouter();
    const { data: shows, refetch } = usePopularShows();
    const { data: watchlist } = useShowWatchlist();
    const { mutate: saveEntry } = useSaveShowWatchlistEntry();
    const { mutate: deleteEntry } = useDeleteShowWatchlistEntry();

    const { displayCount, configuration } = usePosterDimensions({
        size: "medium",
    });

    const styles = useThemedStyles(createStyles, {});

    return (
        <ScreenLayout
            meta={<Stack.Screen options={{ title: "Popular Shows" }} />}
        >
            <FlatList
                data={shows}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.list}
                CellRendererComponent={({ children, cellKey, onLayout }) => (
                    <View
                        key={cellKey}
                        onLayout={onLayout}
                        style={styles.pageElement}
                    >
                        {children}
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
                key={displayCount}
                numColumns={displayCount}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const onWatchlist = watchlist?.entries?.some(
                        ({ showId }) => showId === item.id,
                    );

                    return (
                        <Link
                            href={{
                                pathname: "/shows/show",
                                params: {
                                    id: item.id,
                                    name: item.name,
                                    posterPath: item.posterPath,
                                },
                            }}
                            asChild
                        >
                            <Link.Menu title={item.name}>
                                <Link.MenuAction
                                    title="Add Watch"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/shows/editWatch",
                                            params: { showId: item.id },
                                        })
                                    }
                                    icon="plus"
                                />
                                <Link.MenuAction
                                    title={
                                        onWatchlist
                                            ? "Remove from Watchlist"
                                            : "Add to Watchlist"
                                    }
                                    onPress={() =>
                                        onWatchlist
                                            ? deleteEntry({ showId: item.id })
                                            : saveEntry({ showId: item.id })
                                    }
                                    icon={onWatchlist ? "eye.slash" : "eye"}
                                />
                            </Link.Menu>
                            <Link.Trigger>
                                <Poster
                                    key={item.id}
                                    heading={item.name}
                                    {...configuration}
                                    asLink
                                    imageUri={item.posterPath}
                                />
                            </Link.Trigger>
                            <Link.Preview />
                        </Link>
                    );
                }}
            />
        </ScreenLayout>
    );
};

export default Browse;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: spacing.medium,
            paddingBottom: spacing.large,
        },
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
    });
