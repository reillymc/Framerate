import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MovieCollectionService } from "../services";
import { MovieCollectionKeys } from "./keys";

export const useMovieCollections = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieCollectionKeys.base,
        queryFn: () => MovieCollectionService.getMovieCollections({ session }),
    });
};
