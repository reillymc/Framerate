import { placeholderUserId } from "@/constants/placeholderUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const storageKey = `${placeholderUserId}-movie-searches`;

type RecentSearch = {
    searchValue: string;
};

export const useRecentSearches = () => {
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>();

    useEffect(() => {
        if (!recentSearches) {
            AsyncStorage.getItem(storageKey).then(
                (searches) =>
                    searches && setRecentSearches(JSON.parse(searches)),
            );
        }

        return () => {
            if (!recentSearches) return;

            AsyncStorage.setItem(storageKey, JSON.stringify(recentSearches));
        };
    }, [recentSearches]);

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

    return {
        recentSearches: recentSearches ?? [],
        deleteSearch,
        addSearch,
    };
};
