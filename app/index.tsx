import { SectionHeading, TmdbImage } from "@/components";
import { Poster } from "@/components/poster";
import { MediaType } from "@/constants/mediaTypes";
import { usePopularMovies, useSearch } from "@/hooks";
import { useReviews } from "@/modules/review";
import {
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";

export default function HomeScreen() {
    const { data: reviews } = useReviews();

    const styles = useThemedStyles(createStyles, {});
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const [searchValue, setSearchValue] = useState("");
    const { data: results } = useSearch({ searchValue });
    const { data: popularMovies } = usePopularMovies();

    const posterItemWidth =
        (width - theme.padding.pageHorizontal * 2) * (2 / 3) +
        theme.padding.pageHorizontal / 2;

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Reviews",
                    headerSearchBarOptions: {
                        onChangeText: ({ nativeEvent }) =>
                            setSearchValue(nativeEvent.text),
                        placeholder: "Search movies",
                        hideWhenScrolling: false,
                        hideNavigationBar: false,
                        barTintColor: theme.color.inputBackground,
                        tintColor: theme.color.primary,
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
                    contentContainerStyle={styles.pageElement}
                />
            ) : (
                <FlatList
                    contentInsetAdjustmentBehavior="automatic"
                    ListHeaderComponent={
                        <>
                            <Pressable
                                onPress={() =>
                                    router.navigate({
                                        pathname: "watchlist",
                                        params: { mediaType: MediaType.Movie },
                                    })
                                }
                                style={[
                                    {
                                        borderRadius: 16,
                                        height: 140,
                                        marginHorizontal:
                                            theme.padding.pageHorizontal * 3,
                                        marginBottom: theme.padding.large,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    },
                                ]}
                            >
                                <Text variant="label">Watchlist</Text>
                            </Pressable>
                            <SectionHeading
                                title="New Movies"
                                style={styles.pageElement}
                                onPress={() => null}
                            />
                            <FlatList
                                data={popularMovies}
                                horizontal
                                contentContainerStyle={[
                                    styles.pageElement,
                                    { height: posterItemWidth * (3 / 2) + 60 },
                                ]}
                                snapToAlignment="start"
                                decelerationRate={"fast"}
                                snapToInterval={posterItemWidth}
                                renderItem={({ item }) => (
                                    <Poster
                                        key={item.mediaId}
                                        heading={item.title}
                                        imageUri={item.poster}
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
                            <SectionHeading
                                title="Recently Reviewed"
                                style={styles.pageElement}
                            />
                        </>
                    }
                    data={reviews}
                    CellRendererComponent={({ children }) => (
                        <View style={styles.pageElement}>{children}</View>
                    )}
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
                />
            )}
        </>
    );
}

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
        reviewCard: {
            height: 120,
        },
    });
