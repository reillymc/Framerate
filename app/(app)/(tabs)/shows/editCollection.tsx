import { ScreenLayout } from "@/components";
import {
    useSaveShowCollection,
    useShowCollection,
} from "@/modules/showCollection";
import {
    Action,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const EditCollection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

    const router = useRouter();

    const { data: collection } = useShowCollection(collectionId);
    const { mutate: saveCollection } = useSaveShowCollection();

    const styles = useThemedStyles(createStyles, {});

    const [name, setName] = useState<string>();

    useEffect(() => {
        if (!collection) return;
        setName(collection.name);
    }, [collection]);

    const handleSave = () => {
        const parsedName = name?.trim();
        if (!parsedName) return;

        saveCollection({
            ...collection,
            name: parsedName,
        });

        router.back();
    };

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: collection
                            ? "Edit Collection"
                            : "New Collection",
                        headerLeft: () => (
                            <Action
                                label="Close"
                                style={styles.headerAction}
                                onPress={router.back}
                            />
                        ),
                        headerRight: () => (
                            <Action
                                label={collection ? "Save" : "Create"}
                                style={styles.headerAction}
                                onPress={handleSave}
                            />
                        ),
                    }}
                />
            }
        >
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <TextInput
                    value={name}
                    placeholder="Name"
                    onChangeText={setName}
                />
            </ScrollView>
        </ScreenLayout>
    );
};

export default EditCollection;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.pageBottom * 2,
        },
    });
