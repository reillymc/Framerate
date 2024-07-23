import { TmdbImage } from "@/components";
import { useSearch } from "@/hooks";
import { useReviews } from "@/modules/review";
import {
    Icon,
    ListItem,
    ListItemRow,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
    const { data: reviews } = useReviews();

    const styles = useThemedStyles(createStyles, {});
    const [searchValue, setSearchValue] = useState("");
    const { data: results } = useSearch({ searchValue });

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
                            <Text variant="title">Watch List</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 6,
                                    alignItems: "baseline",
                                }}
                            >
                                <Text variant="title">Recently Reviewed</Text>
                                <Icon
                                    iconName="chevron-right"
                                    set="octicons"
                                    size={24}
                                />
                            </View>
                        </>
                    }
                    ListFooterComponent={
                        <>
                            <Text variant="title">New Movies</Text>
                            <Text variant="title">New TV</Text>
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
