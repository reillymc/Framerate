import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ShowCollectionKeys } from "./keys";

export const useCollectionsForShow = (showId: number | undefined) => {
    const { showCollections } = useFramerateServices();

    return useQuery({
        queryKey: ShowCollectionKeys.byShow(showId),
        enabled: !!showCollections,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: () => showCollections!.findByShow({ showId: showId! }),
    });
};
