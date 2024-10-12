import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Movie } from "../models";

type SearchMoviesRequest = {
    query: string;
};

type SearchMovies = FramerateService<Movie[], SearchMoviesRequest>;

export const searchMovies: SearchMovies = ({ query, session }) =>
    ExecuteRequest(FRAMERATE_API.movies.searchMovies(query), { session });
