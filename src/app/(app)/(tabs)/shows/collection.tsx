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
    EmptyState,
    HeaderIconAction,
    PosterCard,
    ScreenLayout,
} from "@/components";
import {
    useDeleteShowCollectionEntry,
    useShowCollection,
} from "@/modules/showCollection";

const Collection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();
    const styles = useThemedStyles(createStyles, {});

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
                            <HeaderIconAction
                                iconSet={Octicons}
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
                style={styles.list}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
                renderItem={({ item }) => (
                    <SwipeableContainer
                        rightActions={[
                            <SwipeAction
                                key="delete"
                                iconSet={Octicons}
                                iconName="dash"
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
                        <Link
                            href={{
                                pathname: "/shows/show",
                                params: {
                                    id: item.showId,
                                    name: item.name,
                                    posterPath: item.posterPath,
                                },
                            }}
                            asChild
                        >
                            <Link.Menu title={item.name}>
                                <Link.MenuAction
                                    title="Open show"
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
                                    icon="chevron.right"
                                />
                            </Link.Menu>
                            <Link.Trigger>
                                <PosterCard
                                    heading={item.name}
                                    imageUri={item.posterPath}
                                    subHeading={item.status}
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
