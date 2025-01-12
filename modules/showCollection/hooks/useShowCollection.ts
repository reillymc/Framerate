import { useFramerateServices } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShowCollection } from "../models";
import { ShowCollectionKeys } from "./keys";

export const useShowCollection = (collectionId: string | undefined) => {
    const queryClient = useQueryClient();
    const { showCollections } = useFramerateServices();

    return useQuery({
        queryKey: ShowCollectionKeys.collection(collectionId),
        enabled: !!showCollections,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: () => showCollections!.find({ collectionId: collectionId! }),
        placeholderData: () =>
            queryClient
                .getQueryData<ShowCollection[]>(ShowCollectionKeys.base)
                ?.find((d) => d.collectionId === collectionId),
    });
};
