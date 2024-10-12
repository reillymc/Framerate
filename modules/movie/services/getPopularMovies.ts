import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Movie } from "../models";

type GetPopularMovies = FramerateService<Movie[]>;

export const getPopularMovies: GetPopularMovies = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.movies.getPopularMovies(), { session });
