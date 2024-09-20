import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type MovieDetails = {
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
};

type GetMovieParams = {
    id: number;
};

type GetMovie = FramerateService<MovieDetails, GetMovieParams>;

export const getMovie: GetMovie = ({ id, session }) =>
    ExecuteRequest(FRAMERATE_API.movies.getMovie(id), { session });
