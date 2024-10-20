import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { watchlistId } from "../models";
import { ShowEntriesService } from "../services";
import { ShowEntryKeys } from "./keys";

export const useShowEntries = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowEntryKeys.listEntries(watchlistId),
        queryFn: () =>
            ShowEntriesService.getShowEntries({ watchlistId, session }),
        select: (data) => data ?? undefined,
    });
};
