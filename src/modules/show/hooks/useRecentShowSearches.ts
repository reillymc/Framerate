import { useMemo } from "react";

import { useSession } from "@/modules/auth";

import { useRecentSearches } from "@/hooks";

export const useRecentShowSearches = () => {
    const { userId } = useSession();

    const storageKey = useMemo(() => {
        if (!userId) return;
        return `${userId}-show-searches`;
    }, [userId]);

    return useRecentSearches(storageKey);
};
