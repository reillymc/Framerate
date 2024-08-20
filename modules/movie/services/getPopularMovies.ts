import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieSearchResult } from "./searchMovies";

type GetPopularMovies = () => Promise<MovieSearchResult[] | undefined>;

export const getPopularMovies: GetPopularMovies = () =>
    ExecuteRequest(FRAMERATE_API.movies.getPopularMovies());
