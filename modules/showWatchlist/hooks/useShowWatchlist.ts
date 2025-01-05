import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowWatchlistService } from "../services";
import { ShowWatchlistKeys } from "./keys";

export const useShowWatchlist = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowWatchlistKeys.base,
        queryFn: () => ShowWatchlistService.getWatchlist({ session }),
    });
};
