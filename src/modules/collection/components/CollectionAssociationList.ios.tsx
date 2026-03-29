import type { FC } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import { Octicons } from "@expo/vector-icons";
import {
    IconAction,
    Tag,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import type { CollectionAssociationListProps } from "./CollectionAssociationList";

export const CollectionAssociationList: FC<CollectionAssociationListProps> = ({
    associatedCollections,
    unassociatedCollections,
    onSaveToCollection,
    onRemoveFromCollection,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collections}
            data={associatedCollections}
            keyExtractor={(item) => item.collectionId}
            renderItem={({ item }) => (
                <Host matchContents>
                    <ContextMenu>
                        <ContextMenu.Items>
                            <Button
                                label={"Remove from collection"}
                                systemImage="trash"
                                onPress={() =>
                                    onRemoveFromCollection(item.collectionId)
                                }
                            />
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <Tag label={item.name} variant="light" />
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </Host>
            )}
            ListFooterComponent={
                unassociatedCollections?.length ? (
                    <Host matchContents>
                        <ContextMenu>
                            <ContextMenu.Items>
                                {unassociatedCollections?.map(
                                    ({ collectionId, name }) => (
                                        <Button
                                            key={collectionId}
                                            label={name}
                                            systemImage="plus"
                                            onPress={() =>
                                                onSaveToCollection(collectionId)
                                            }
                                        />
                                    ),
                                )}
                            </ContextMenu.Items>
                            <ContextMenu.Trigger>
                                <IconAction
                                    iconSet={Octicons}
                                    iconName="book"
                                    label="Save to collection"
                                />
                            </ContextMenu.Trigger>
                        </ContextMenu>
                    </Host>
                ) : null
            }
        />
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        collections: {
            paddingVertical: spacing.medium,
            paddingHorizontal: spacing.pageHorizontal,
            alignItems: "center",
            gap: spacing.small,
        },
    });
