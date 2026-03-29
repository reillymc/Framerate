import type { FC } from "react";
import { Alert, RefreshControl, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Link, Stack, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import {
    ListItem,
    SwipeAction,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { EmptyState, HeaderIconAction, ScreenLayout } from "@/components";
import {
    useDeleteShowCollection,
    useShowCollections,
} from "@/modules/showCollection";

const Collections: FC = () => {
    const router = useRouter();
    const { data: collections, isLoading, refetch } = useShowCollections();
    const { mutate: deleteCollection } = useDeleteShowCollection();
    const styles = useThemedStyles(createStyles, {});

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
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
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
                            <ListItem
                                heading={item.name}
                                swipeActions={[
                                    <SwipeAction
                                        key="delete"
                                        iconSet={Octicons}
                                        iconName="dash"
                                        onPress={() =>
                                            handleDeleteCollection(
                                                item.collectionId,
                                            )
                                        }
                                        variant="destructive"
                                    />,
                                ]}
                            />
                        </Link.Trigger>
                        <Link.Preview />
                    </Link>
                )}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={refetch} />
                }
            />
        </ScreenLayout>
    );
};

export default Collections;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: spacing.small,
            paddingHorizontal: spacing.pageHorizontal,
        },
    });
