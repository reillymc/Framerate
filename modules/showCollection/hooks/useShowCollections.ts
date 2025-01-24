import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ShowCollectionKeys } from "./keys";

export const useShowCollections = () => {
    const { showCollections } = useFramerateServices();

    return useQuery({
        queryKey: ShowCollectionKeys.base,
        enabled: !!showCollections,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => showCollections!.findAll({ signal }),
    });
};
