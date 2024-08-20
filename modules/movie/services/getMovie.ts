import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface MovieDetails {
    // TMDB ID
    id: number;
    imdbId: string;
    title: string;
    posterPath?: string;
    backdropPath?: string;
    releaseDate: string;
    overview: string;
    tagline: string;
    popularity: number;
    runtime: number;
}

type GetMovieParams = {
    id: number;
};

type GetMovie = (params: GetMovieParams) => Promise<MovieDetails | undefined>;

export const getMovie: GetMovie = ({ id }) =>
    ExecuteRequest(FRAMERATE_API.movies.getMovie(id));
