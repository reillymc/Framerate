import { useSession } from "@/modules/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

type RecentSearch = {
    searchValue: string;
};

export const useRecentSearches = () => {
    const { userId } = useSession();

    const storageKey = useMemo(() => {
        if (!userId) return;
        return `${userId}-show-searches`;
    }, [userId]);

    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>();

    useEffect(() => {
        if (!recentSearches && storageKey) {
            AsyncStorage.getItem(storageKey).then(
                (searches) =>
                    searches && setRecentSearches(JSON.parse(searches)),
            );
        }

        return () => {
            if (!(recentSearches && storageKey)) return;

            AsyncStorage.setItem(storageKey, JSON.stringify(recentSearches));
        };
    }, [recentSearches, storageKey]);

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
