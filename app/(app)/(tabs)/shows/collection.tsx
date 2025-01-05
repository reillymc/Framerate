import { EmptyState, PosterCard, ScreenLayout } from "@/components";
import {
    useDeleteShowCollectionEntry,
    useShowCollection,
} from "@/modules/showCollection";
import {
    IconActionV2,
    SwipeAction,
    SwipeView,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

const Collection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

    const router = useRouter();
    const {
        data: collection,
        isLoading,
        refetch,
    } = useShowCollection(collectionId);
    const { mutate: deleteCollectionEntry } = useDeleteShowCollectionEntry();

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
                                        pathname: "/shows/editCollection",
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
                <EmptyState heading="There are no shows in this collection yet..." />
            }
            loading={<EmptyState heading="Loading..." />}
        >
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={collection?.entries ?? []}
                keyExtractor={(show) => show.showId.toString()}
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
                                        showId: item.showId,
                                    })
                                }
                                variant="destructive"
                            />,
                        ]}
                    >
                        <PosterCard
                            heading={item.name}
                            imageUri={item.posterPath}
                            releaseDate={item.status}
                            onPress={() =>
                                router.push({
                                    pathname: "/shows/show",
                                    params: {
                                        id: item.showId,
                                        name: item.name,
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
