import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Movie } from "../models";

type GetMovieRequest = {
    id: number;
};

type GetMovie = FramerateService<Movie, GetMovieRequest>;

export const getMovie: GetMovie = ({ id, session }) =>
    ExecuteRequest(FRAMERATE_API.movies.getMovie(id), { session });
