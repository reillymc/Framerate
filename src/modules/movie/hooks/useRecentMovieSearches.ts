import { useMemo } from "react";

import { useRecentSearches } from "@/hooks";
import { useSession } from "@/modules/auth";

export const useRecentMovieSearches = () => {
    const { userId } = useSession();

    const storageKey = useMemo(() => {
        if (!userId) return;
        return `${userId}-show-searches`;
    }, [userId]);

    return useRecentSearches(storageKey);
};
