import { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import type {
    SelectionInputProps,
    ValueItem,
} from "@reillymc/react-native-components";

type UseSelectionModalParams<T> = Pick<
    SelectionInputProps<T>,
    "selectionMode" | "items"
> & {
    key: string;
    label: string;
    placeholder?: string;
    initialSelection?: ValueItem<T>[];
};

export const useSelectionModal = <T>({
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
