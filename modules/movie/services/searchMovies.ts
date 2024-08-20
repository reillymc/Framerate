import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface MovieSearchResult {
    id: number;
    title: string;
    posterPath?: string;
    backdropPath?: string;
    releaseDate?: string;
    overview: string;
    popularity: number;
}

type SearchMoviesParams = {
    query: string;
};

type SearchMovies = (
    params: SearchMoviesParams,
) => Promise<MovieSearchResult[] | undefined>;

export const searchMovies: SearchMovies = ({ query }) =>
    ExecuteRequest(FRAMERATE_API.movies.searchMovies(query));
