import { type FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    Action,
    TextInput,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    useMovieCollection,
    useSaveMovieCollection,
} from "@/modules/movieCollection";

import { HeaderCloseAction, ScreenLayout } from "@/components";

const EditCollection: FC = () => {
    const { collectionId } = useLocalSearchParams<{ collectionId: string }>();

    const router = useRouter();

    const { data: collection } = useMovieCollection(collectionId);
    const { mutate: saveCollection } = useSaveMovieCollection();

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
                            <HeaderCloseAction onClose={router.back} />
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
                    maxLength={60}
                    onChangeText={setName}
                />
            </ScrollView>
        </ScreenLayout>
    );
};

export default EditCollection;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: spacing.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom * 2,
        },
    });
