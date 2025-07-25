import { useCallback, useEffect, useReducer } from "react";
import { Platform } from "react-native";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
    return useReducer(
        (
            _: [boolean, T | null],
            action: T | null = null,
        ): [boolean, T | null] => [false, action],
        initialValue,
    ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === "web") {
        try {
            if (value === null) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error("Local storage is unavailable:", e);
        }
    } else if (value == null) {
        await deleteItemAsync(key);
    } else {
        await setItemAsync(key, value);
    }
}

export function useStorageState(key: string) {
    const [state, setState] = useAsyncState<string>();

    const refetch = useCallback(() => {
        if (Platform.OS === "web") {
            try {
                if (typeof localStorage !== "undefined") {
                    setState(localStorage.getItem(key));
                }
            } catch (e) {
                console.error("Local storage is unavailable:", e);
            }
        } else {
            getItemAsync(key).then((value) => {
                setState(value);
            });
        }
    }, [key, setState]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const setValue = useCallback(
        (value: string | null) => {
            setState(value);
            setStorageItemAsync(key, value);
        },
        [key, setState],
    );

    return [state[1], setValue, { loading: state[0], refetch }] as const;
}
