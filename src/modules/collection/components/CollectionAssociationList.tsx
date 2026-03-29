import type { FC } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
    IconAction,
    Tag,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

export interface CollectionAssociationListProps {
    associatedCollections:
        | Array<{ collectionId: string; name: string }>
        | undefined;
    unassociatedCollections:
        | Array<{ collectionId: string; name: string }>
        | undefined;
    onSaveToCollection: (collectionId: string) => void;
    onRemoveFromCollection: (collectionId: string) => void;
}

export const CollectionAssociationList: FC<CollectionAssociationListProps> = ({
    associatedCollections,
    unassociatedCollections,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collections}
            data={associatedCollections}
            keyExtractor={(item) => item.collectionId}
            renderItem={({ item }) => <Tag label={item.name} variant="light" />}
            ListFooterComponent={
                unassociatedCollections?.length ? (
                    <IconAction
                        iconSet={Octicons}
                        iconName="book"
                        label="Save to collection"
                    />
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
