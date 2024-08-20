import { Poster } from "@/components/poster";
import { usePopularMovies } from "@/modules/movie";
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Poster
                        key={item.id}
                        heading={item.title}
                        size="medium"
                        imageUri={item.posterPath}
                        onPress={() =>
                            router.push({
                                pathname: "/movies/movie",
                                params: {
                                    mediaId: item.id,
                                    mediaTitle: item.title,
                                    mediaPosterUri: item.posterPath,
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
