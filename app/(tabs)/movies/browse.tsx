import { Poster } from "@/components/poster";
import { usePopularMovies } from "@/hooks";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import type { FC } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const Browse: FC = () => {
    const { data: movies } = usePopularMovies();

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Popular Movies",
                }}
            />
            <FlatList
                data={movies}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.list}
                CellRendererComponent={({ children }) => (
                    <View style={styles.pageElement}>{children}</View>
                )}
                numColumns={2}
                keyExtractor={(item) => item.mediaId.toString()}
                renderItem={({ item }) => (
                    <Poster
                        key={item.mediaId}
                        heading={item.title}
                        size="medium"
                        imageUri={item.poster}
                        onPress={() =>
                            router.push({
                                pathname: "/movies/movie",
                                params: {
                                    mediaId: item.mediaId,
                                    mediaTitle: item.title,
                                    mediaPosterUri: item.poster,
                                },
                            })
                        }
                    />
                )}
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
