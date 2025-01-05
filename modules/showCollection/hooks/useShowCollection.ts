import { useSession } from "@/modules/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import { ShowCollectionService } from "../services";
import { ShowCollectionKeys } from "./keys";

export const useShowCollection = (collectionId: string | undefined) => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useQuery({
        queryKey: ShowCollectionKeys.collection(collectionId),
        queryFn: () =>
            ShowCollectionService.getShowCollection({
                // biome-ignore lint/style/noNonNullAssertion: movieId is guaranteed to be defined by the enabled flag
                collectionId: collectionId!,
                session,
            }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowCollection[]>(ShowCollectionKeys.base)
                ?.find((d) => d.collectionId === collectionId),
    });
};
