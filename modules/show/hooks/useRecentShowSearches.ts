import { useRecentSearches } from "@/hooks";
import { useSession } from "@/modules/auth";
import { useMemo } from "react";

export const useRecentShowSearches = () => {
    const { userId } = useSession();

    const storageKey = useMemo(() => {
        if (!userId) return;
        return `${userId}-show-searches`;
    }, [userId]);

    return useRecentSearches(storageKey);
};
