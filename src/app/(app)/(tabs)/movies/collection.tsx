import type { FC } from "react";
import { StyleSheet } from "react-native";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import {
    SwipeAction,
    SwipeableContainer,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    useDeleteMovieCollectionEntry,
    useMovieCollection,
} from "@/modules/movieCollection";

import {
    EmptyState,
    HeaderIconAction,
    PosterCard,
    ScreenLayout,
} from "@/components";
import { displayFullNumeric } from "@/helpers/dateHelper";

const Collection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
    const styles = useThemedStyles(createStyles, {});

    const router = useRouter();
    const {
        data: collection,
        isLoading,
        refetch,
    } = useMovieCollection(collectionId);
    const { mutate: deleteCollectionEntry } = useDeleteMovieCollectionEntry();

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: collection?.name ?? "Loading...",
                        headerRight: () => (
                            <HeaderIconAction
                                iconSet={Octicons}
                                iconName="pencil"
                                onPress={() =>
                                    router.push({
                                        pathname: "/movies/editCollection",
                                        params: { collectionId },
                                    })
                                }
                            />
                        ),
                    }}
                />
            }
            isLoading={isLoading}
            isEmpty={!collection?.entries?.length}
            empty={
                <EmptyState heading="There are no movies in this collection yet..." />
            }
            loading={<EmptyState heading="Loading..." />}
        >
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={collection?.entries ?? []}
                keyExtractor={(movie) => movie.movieId.toString()}
                style={styles.list}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
                renderItem={({ item }) => (
                    <SwipeableContainer
                        rightActions={[
                            <SwipeAction
                                iconSet={Octicons}
                                key="delete"
                                iconName="dash"
                                onPress={() =>
                                    deleteCollectionEntry({
                                        collectionId,
                                        movieId: item.movieId,
                                    })
                                }
                                variant="destructive"
                            />,
                        ]}
                    >
                        <Link
                            href={{
                                pathname: "/movies/movie",
                                params: {
                                    id: item.movieId,
                                    title: item.title,
                                    posterPath: item.posterPath,
                                },
                            }}
                            asChild
                        >
                            <Link.Menu title={item.title}>
                                <Link.MenuAction
                                    title="Add Watch"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/movies/editWatch",
                                            params: { movieId: item.movieId },
                                        })
                                    }
                                    icon="plus"
                                />
                                <Link.MenuAction
                                    title={`Remove from ${collection?.name}`}
                                    onPress={() =>
                                        deleteCollectionEntry({
                                            collectionId,
                                            movieId: item.movieId,
                                        })
                                    }
                                    icon={"trash"}
                                />
                            </Link.Menu>
                            <Link.Trigger>
                                <PosterCard
                                    heading={item.title}
                                    imageUri={item.posterPath}
                                    subHeading={displayFullNumeric(
                                        item.releaseDate,
                                    )}
                                    asLink
                                    onPress={() =>
                                        router.push({
                                            pathname: "/movies/movie",
                                            params: {
                                                id: item.movieId,
                                                name: item.title,
                                                posterPath: item.posterPath,
                                            },
                                        })
                                    }
                                />
                            </Link.Trigger>
                            <Link.Preview />
                        </Link>
                    </SwipeableContainer>
                )}
            />
        </ScreenLayout>
    );
};

export default Collection;

const createStyles = ({ theme: { color } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            backgroundColor: color.background,
        },
    });
