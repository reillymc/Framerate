import { getMovie } from "./getMovie";
import { getPopularMovies } from "./getPopularMovies";
import { searchMovies } from "./searchMovies";

export const MoviesService = {
    getMovie,
    getPopularMovies,
    searchMovies,
};

export { MovieDetails } from "./getMovie";
export { MovieSearchResult } from "./searchMovies";
