import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieCollection } from "../models";

type GetMovieCollections = FramerateService<MovieCollection[]>;

export const getMovieCollections: GetMovieCollections = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.movieCollections.getCollections(), {
        session,
    });
