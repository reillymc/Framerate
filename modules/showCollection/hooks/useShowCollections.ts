import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { ShowCollectionService } from "../services";
import { ShowCollectionKeys } from "./keys";

export const useShowCollections = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: ShowCollectionKeys.base,
        queryFn: () => ShowCollectionService.getShowCollections({ session }),
    });
};
