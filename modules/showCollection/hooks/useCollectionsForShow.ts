import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowCollectionService } from "../services";
import { ShowCollectionKeys } from "./keys";

export const useCollectionsForShow = (showId: number | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowCollectionKeys.byShow(showId),
        queryFn: () =>
            ShowCollectionService.getCollectionsForShow({
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                showId: showId!,
                session,
            }),
    });
};
