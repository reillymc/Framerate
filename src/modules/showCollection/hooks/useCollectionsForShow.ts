import { useQuery } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";

import { ShowCollectionKeys } from "./keys";

export const useCollectionsForShow = (showId: number | undefined) => {
    const { showCollections } = useFramerateServices();

    return useQuery({
        queryKey: ShowCollectionKeys.byShow(showId),
        enabled: !!showCollections,
        queryFn: ({ signal }) =>
            // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
            showCollections!.findByShow({ showId: showId! }, { signal }),
    });
};
