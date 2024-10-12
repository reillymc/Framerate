import { Poster } from "@/components/poster";
import { usePopularShows } from "@/modules/show";
import { useWatchlistEntries } from "@/modules/watchlistEntry";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import type { FC } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const Browse: FC = () => {
    const { data: shows, refetch } = usePopularShows();
    const { data: watchlistEntries = [] } = useWatchlistEntries("show");

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
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const onWatchlist = watchlistEntries.some(
                        ({ mediaId }) => mediaId === item.id,
                    );

                    return (
                        <Poster
                            key={item.id}
                            heading={item.name}
                            size="medium"
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

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: padding.regular,
            paddingBottom: padding.large,
        },
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
    });
