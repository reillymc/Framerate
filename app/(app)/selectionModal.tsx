import {
    Action,
    DropdownItem,
    type SelectionInputProps,
    Tag,
    Text,
    type ThemedStyles,
    type ValueItem,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

type UseSelectionModalParams<T> = Pick<
    SelectionInputProps<T>,
    "selectionMode" | "items"
> & {
    key: string;
    label: string;
    placeholder?: string;
    initialSelection?: ValueItem<T>[];
};

export const useSelectionModal = <T,>({
    key,
    initialSelection,
    label,
    items,
    placeholder,
    selectionMode,
}: UseSelectionModalParams<T>) => {
    const router = useRouter();

    const { key: keyParam, selection: selectionParam } =
        useGlobalSearchParams();

    const isActive = useMemo(() => key === keyParam, [key, keyParam]);

    const selectedItemsFromParams = useMemo(() => {
        if (
            !(isActive && selectionParam) ||
            selectionParam === "undefined" ||
            Array.isArray(selectionParam)
        )
            return;

        return JSON.parse(selectionParam) as Array<ValueItem<T>>;
    }, [isActive, selectionParam]);

    const [tempSelectedItems, setTempSelectedItems] =
        useState<ValueItem<T>[]>();

    useEffect(() => {
        if (!(isActive && selectedItemsFromParams)) return;
        setTempSelectedItems(selectedItemsFromParams);
    }, [isActive, selectedItemsFromParams]);

    const selectedWithInitial = useMemo(
        () => tempSelectedItems ?? initialSelection ?? [],
        [tempSelectedItems, initialSelection],
    );

    const openSelectionModal = useCallback(() => {
        router.push({
            pathname: "/selectionModal",
            params: {
                key,
                selectionMode: selectionMode,
                label,
                placeholder,
                items: JSON.stringify(items),
                selection: selectedWithInitial
                    ? JSON.stringify(selectedWithInitial)
                    : undefined,
            },
        });
    }, [
        items,
        key,
        label,
        placeholder,
        router,
        selectedWithInitial,
        selectionMode,
    ]);

    return {
        selectedItems: selectedWithInitial,
        openSelectionModal,
    };
};

const SelectionModal: FC = () => {
    const styles = useThemedStyles(createStyles, {});
    const router = useRouter();

    const {
        items: rawItems,
        selection: rawSelection,
        selectionMode: rawSelectionMode,
        label,
        placeholder = "Select items",
    } = useGlobalSearchParams();

    const items = useMemo(() => {
        if (!rawItems || rawItems === "undefined" || Array.isArray(rawItems))
            return;

        return JSON.parse(rawItems);
    }, [rawItems]) as Array<ValueItem & { id?: string }>;

    const selectedItems = useMemo(() => {
        if (
            !rawSelection ||
            rawSelection === "undefined" ||
            Array.isArray(rawSelection)
        )
            return [];

        return JSON.parse(rawSelection) as Array<
            ValueItem | ValueItem<unknown>
        >;
    }, [rawSelection]);

    const selectionMode = useMemo(() => {
        switch (rawSelectionMode) {
            case "multi":
            case "single":
                return rawSelectionMode;
            default:
                return "single";
        }
    }, [rawSelectionMode]);

    const onSelectItem = useCallback(
        (item: ValueItem | ValueItem<unknown>) => {
            const newValue = selectedItems.some(
                (selectedItem) => selectedItem.value === item.value,
            )
                ? selectedItems.filter(
                      (selectedItem) => selectedItem.value !== item.value,
                  )
                : [...selectedItems, item];

            router.setParams({
                selection: JSON.stringify(newValue),
            });
        },
        [router, selectedItems],
    );

    const handleItemPress = (item: ValueItem | ValueItem<unknown>) => {
        onSelectItem(item);

        if (selectionMode === "single") {
            router.back();
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: label as string,
                    headerLargeTitle: false,
                    headerRight: () => (
                        <Action
                            label="Done"
                            style={styles.headerAction}
                            onPress={() => router.back()}
                        />
                    ),
                }}
            />
            <FlatList
                data={items}
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    selectionMode === "multi" ? (
                        <View style={styles.selectionDisplay}>
                            {!!selectedItems.length && (
                                <View style={styles.clearButton}>
                                    <Action
                                        label="Clear"
                                        onPress={() =>
                                            router.setParams({
                                                selection: JSON.stringify([]),
                                            })
                                        }
                                    />
                                </View>
                            )}
                            <FlatList
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) =>
                                    "id" in item
                                        ? item.id
                                        : item.value.toString()
                                }
                                data={selectedItems}
                                contentContainerStyle={
                                    styles.previewTagContainer
                                }
                                ListEmptyComponent={
                                    <Text
                                        variant="caption"
                                        style={styles.previewPlaceholder}
                                    >
                                        {placeholder}
                                    </Text>
                                }
                                renderItem={({ item }) => (
                                    <Tag
                                        label={item.label}
                                        style={styles.tag}
                                        variant="light"
                                        iconName="closecircle"
                                        onPress={() => handleItemPress(item)}
                                    />
                                )}
                            />
                        </View>
                    ) : null
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <DropdownItem
                            key={"id" in item ? item.id : item.value}
                            item={item}
                            searchValue={
                                selectedItems.find(
                                    (selectedItem) =>
                                        selectedItem.value === item.value,
                                )?.label
                            }
                            onPress={() => handleItemPress(item)}
                        />
                    </View>
                )}
            />
        </>
    );
};

export default SelectionModal;

const createStyles = ({
    styles: { baseInput },
    theme: { spacing, color },
}: ThemedStyles) => {
    const styles = StyleSheet.create({
        headerAction: {
            marginHorizontal: spacing.navigationActionHorizontal,
        },
        list: {
            paddingBottom: spacing.pageBottom,
        },
        tag: {
            marginVertical: 2,
        },
        item: {
            paddingHorizontal: spacing.small,
        },
        selectionDisplay: {
            flexDirection: "row",
            marginTop: spacing.tiny,
            marginBottom: spacing.medium,
            overflow: "hidden",
        },
        previewTagContainer: {
            paddingLeft: baseInput.padding,
            paddingVertical: spacing.tiny,
            height: 48,
        },
        previewPlaceholder: {
            alignSelf: "center",
            paddingLeft: baseInput.padding,
        },
        clearButton: {
            paddingHorizontal: spacing.medium,
            marginVertical: spacing.tiny + 2,
            borderRightColor: color.border,
            borderRightWidth: 1,
            justifyContent: "center",
        },
    });
    return styles;
};
