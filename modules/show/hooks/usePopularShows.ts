import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowsService } from "../services";
import { ShowKeys } from "./keys";

export const usePopularShows = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowKeys.popular(),
        queryFn: () => ShowsService.getPopularShows({ session }),
        enabled: !!session,
    });
};
