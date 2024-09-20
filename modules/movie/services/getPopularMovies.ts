import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieSearchResult } from "./searchMovies";

type GetPopularMovies = FramerateService<MovieSearchResult[]>;

export const getPopularMovies: GetPopularMovies = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.movies.getPopularMovies(), { session });
