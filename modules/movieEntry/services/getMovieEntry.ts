import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "../models";

type GetMovieEntryRequest = {
    watchlistId: string;
    movieId: number;
};

type GetMovieEntry = FramerateService<MovieEntry, GetMovieEntryRequest>;

export const getMovieEntry: GetMovieEntry = ({
    movieId,
    watchlistId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieEntries.getEntry(watchlistId, movieId),
        // It is expected that a 404 error will be returned if the entry does not exist
        { session, silenceWarnings: [404] },
    );
