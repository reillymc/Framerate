import { SectionHeading, TmdbImage } from "@/components";
import { usePopularMovies, usePopularShows, useSearch } from "@/hooks";
import { useReviews } from "@/modules/review";
import {
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";

export default function HomeScreen() {
    const { data: reviews } = useReviews();

    const styles = useThemedStyles(createStyles, {});
    const [searchValue, setSearchValue] = useState("");
    const { data: results } = useSearch({ searchValue });
    const { data: popularMovies } = usePopularMovies();
    const { data: popularShows } = usePopularShows();

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Reviews",
                    headerSearchBarOptions: {
                        onChangeText: ({ nativeEvent }) =>
                            setSearchValue(nativeEvent.text),
                        placeholder: "Search for a movie or show",
                        hideWhenScrolling: false,
                        hideNavigationBar: false,
                    },
                }}
            />
            {searchValue ? (
                <FlatList
                    data={results}
                    keyboardDismissMode="on-drag"
                    renderItem={({ item }) => (
                        <ListItem
                            header={
                                <Text>{`${item.title} (${item.year})`}</Text>
                            }
                            onPress={() =>
                                router.push({
                                    pathname: "movie",
                                    params: { mediaId: item.mediaId },
                                })
                            }
                        />
                    )}
                    keyExtractor={(item) => item.mediaId.toString()}
                    contentInsetAdjustmentBehavior="always"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.list}
                />
            ) : (
                <FlatList
                    contentInsetAdjustmentBehavior="automatic"
                    ListHeaderComponent={
                        <>
                            <SectionHeading title="Watchlist" />
                            <SectionHeading title="New Movies" />
                            <FlatList
                                data={popularMovies}
                                horizontal
                                renderItem={({ item }) => (
                                    <ListItem
                                        key={item.mediaId}
                                        style={styles.reviewCard}
                                        heading={item.title}
                                        avatar={
                                            <TmdbImage
                                                type="poster"
                                                path={item.poster}
                                                style={{
                                                    width: 80,
                                                    height: "100%",
                                                }}
                                            />
                                        }
                                        contentRows={[
                                            <ListItemRow
                                                key="details"
                                                contentItems={[
                                                    <Text key="date">
                                                        {item.popularity}
                                                    </Text>,
                                                ]}
                                            />,
                                        ]}
                                        onPress={() =>
                                            router.push({
                                                pathname: "movie",
                                                params: {
                                                    mediaId: item.mediaId,
                                                },
                                            })
                                        }
                                    />
                                )}
                            />
                            <SectionHeading title="New Shows" />
                            <FlatList
                                data={popularShows}
                                horizontal
                                renderItem={({ item }) => (
                                    <ListItem
                                        key={item.mediaId}
                                        style={styles.reviewCard}
                                        heading={item.title}
                                        avatar={
                                            <TmdbImage
                                                type="poster"
                                                path={item.poster}
                                                style={{
                                                    width: 80,
                                                    height: "100%",
                                                }}
                                            />
                                        }
                                        contentRows={[
                                            <ListItemRow
                                                key="details"
                                                contentItems={[
                                                    <Text key="date">
                                                        {item.popularity}
                                                    </Text>,
                                                ]}
                                            />,
                                        ]}
                                        onPress={() =>
                                            router.push({
                                                pathname: "show",
                                                params: {
                                                    mediaId: item.mediaId,
                                                },
                                            })
                                        }
                                    />
                                )}
                            />

                            <SectionHeading title="Recently Reviewed" />
                        </>
                    }
                    data={reviews}
                    renderItem={({ item }) => (
                        <ListItem
                            key={item.reviewId}
                            style={styles.reviewCard}
                            heading={`${item.mediaTitle} (${item.mediaReleaseYear})`}
                            avatar={
                                <TmdbImage
                                    type="poster"
                                    path={item.mediaPosterUri}
                                    style={{ width: 80, height: "100%" }}
                                />
                            }
                            contentRows={[
                                <ListItemRow
                                    key="details"
                                    contentItems={[
                                        <Text key="date">
                                            {new Date(item.date).toDateString()}
                                        </Text>,
                                    ]}
                                />,
                            ]}
                            onPress={() =>
                                router.push({
                                    pathname: "movie",
                                    params: { mediaId: item.mediaId },
                                })
                            }
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </>
    );
}

const createStyles = ({
    theme: { color, padding },
    styles: { baseInput },
}: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingHorizontal: padding.pageHorizontal,
        },
        reviewCard: {
            height: 120,
        },
    });
