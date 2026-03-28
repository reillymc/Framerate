import type { FC } from "react";
import { Alert, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Link, Stack, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import {
    SwipeAction,
    SwipeableContainer,
} from "@reillymc/react-native-components";

import {
    EmptyState,
    HeaderIconAction,
    PosterCard,
    ScreenLayout,
} from "@/components";
import {
    useDeleteShowCollection,
    useShowCollections,
} from "@/modules/showCollection";

const Collections: FC = () => {
    const router = useRouter();
    const { data: collections, isLoading, refetch } = useShowCollections();
    const { mutate: deleteCollection } = useDeleteShowCollection();

    const handleDeleteCollection = (collectionId: string) => {
        Alert.alert(
            "Are you sure you want to delete this collection?",
            "This will remove all of your saved items and cannot be undone",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: () => deleteCollection({ collectionId }),
                },
            ],
        );
    };

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: "Collections",
                        headerRight: () => (
                            <HeaderIconAction
                                iconSet={Octicons}
                                iconName="plus"
                                onPress={() =>
                                    router.push({
                                        pathname: "/shows/editCollection",
                                    })
                                }
                            />
                        ),
                    }}
                />
            }
            isLoading={isLoading}
            isEmpty={!collections?.length}
            empty={<EmptyState heading="No collections" />}
            loading={<EmptyState heading="Loading..." />}
        >
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={collections ?? []}
                keyExtractor={(collection) => collection.collectionId}
                renderItem={({ item }) => (
                    <SwipeableContainer
                        rightActions={[
                            <SwipeAction
                                key="delete"
                                iconSet={Octicons}
                                iconName="dash"
                                onPress={() =>
                                    handleDeleteCollection(item.collectionId)
                                }
                                variant="destructive"
                            />,
                        ]}
                    >
                        <Link
                            href={{
                                pathname: "/shows/collection",
                                params: {
                                    collectionId: item.collectionId,
                                },
                            }}
                            asChild
                        >
                            <Link.Trigger>
                                <PosterCard heading={item.name} />
                            </Link.Trigger>
                            <Link.Preview />
                        </Link>
                    </SwipeableContainer>
                )}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
            />
        </ScreenLayout>
    );
};

export default Collections;
