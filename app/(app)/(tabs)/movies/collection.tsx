import type { FC } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    IconActionV2,
    SwipeAction,
    SwipeView,
} from "@reillymc/react-native-components";

import {
    useDeleteMovieCollectionEntry,
    useMovieCollection,
} from "@/modules/movieCollection";

import { EmptyState, PosterCard, ScreenLayout } from "@/components";
import { displayFullNumeric } from "@/helpers/dateHelper";

const Collection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

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
                            <IconActionV2
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
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
                renderItem={({ item }) => (
                    <SwipeView
                        rightActions={[
                            <SwipeAction
                                key="delete"
                                iconName="minus"
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
                        <PosterCard
                            heading={item.title}
                            imageUri={item.posterPath}
                            subHeading={displayFullNumeric(item.releaseDate)}
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
                    </SwipeView>
                )}
            />
        </ScreenLayout>
    );
};

export default Collection;
