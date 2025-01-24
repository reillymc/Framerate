import { Poster, usePosterDimensions } from "@/components/poster";
import { usePopularShows } from "@/modules/show";
import { useShowWatchlist } from "@/modules/showWatchlist";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const Browse: FC = () => {
    const router = useRouter();
    const { data: shows, refetch } = usePopularShows();
    const { data: watchlist } = useShowWatchlist();

    const { displayCount, configuration } = usePosterDimensions({
        size: "medium",
    });

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen options={{ title: "Popular Shows" }} />
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
                        <Poster
                            key={item.id}
                            heading={item.name}
                            {...configuration}
                            imageUri={item.posterPath}
                            onWatchlist={onWatchlist}
                            onPress={() =>
                                router.push({
                                    pathname: "/shows/show",
                                    params: {
                                        id: item.id,
                                        name: item.name,
                                        posterPath: item.posterPath,
                                    },
                                })
                            }
                        />
                    );
                }}
            />
        </>
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
