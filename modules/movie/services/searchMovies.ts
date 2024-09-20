import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type MovieSearchResult = {
    id: number;
    title: string;
    posterPath?: string;
    backdropPath?: string;
    releaseDate?: string;
    overview: string;
    popularity: number;
};

type SearchMoviesRequest = {
    query: string;
};

type SearchMovies = FramerateService<MovieSearchResult[], SearchMoviesRequest>;

export const searchMovies: SearchMovies = ({ query, session }) =>
    ExecuteRequest(FRAMERATE_API.movies.searchMovies(query), { session });
