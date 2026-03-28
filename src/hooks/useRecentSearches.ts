import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RecentSearch = {
    searchValue: string;
};

export const useRecentSearches = (key: string | undefined) => {
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    useEffect(() => {
        if (!recentSearches && key) {
            AsyncStorage.getItem(key).then(
                (searches) =>
                    searches && setRecentSearches(JSON.parse(searches)),
            );
        }

        return () => {
            if (!(recentSearches && key)) return;

            AsyncStorage.setItem(key, JSON.stringify(recentSearches));
        };
    }, [recentSearches, key]);

    const deleteSearch = useCallback((index: number) => {
        setRecentSearches((prev) => [...(prev ?? [])].toSpliced(index, 1));
    }, []);

    const addSearch = useCallback(
        (search: RecentSearch) =>
            setRecentSearches((prev) =>
                [
                    search,
                    ...(prev ?? []).filter(
                        ({ searchValue }) => searchValue !== search.searchValue,
                    ),
                ].slice(0, 5),
            ),
        [],
    );

    return { recentSearches, deleteSearch, addSearch };
};
