import { useQuery } from "@tanstack/react-query";
import { MoviesService } from "../services";
import { MovieKeys } from "./keys";

export const usePopularMovies = () =>
    useQuery({
        queryKey: MovieKeys.popular(),
        queryFn: () => MoviesService.getPopularMovies(),
    });
