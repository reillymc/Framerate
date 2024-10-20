import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "../models";

type GetMovieEntriesRequest = {
    watchlistId: string;
};

type GetMovieEntries = FramerateService<MovieEntry[], GetMovieEntriesRequest>;

export const getMovieEntries: GetMovieEntries = ({ watchlistId, session }) =>
    ExecuteRequest(FRAMERATE_API.movieEntries.getEntries(watchlistId), {
        session,
    });
