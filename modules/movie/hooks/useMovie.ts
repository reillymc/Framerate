import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import { MovieKeys } from "./keys";

export const useMovie = (id: number | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: MovieKeys.details(id),
        enabled: !!id,
        queryFn: () =>
            MoviesService.getMovie({
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                id: id!,
                session,
            }),
    });
};
