import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "../models";

export type SaveMovieEntryRequest = {
    watchlistId: string;
    movieId: number;
};

type SaveMovieEntry = FramerateService<MovieEntry, SaveMovieEntryRequest>;

export const saveMovieEntry: SaveMovieEntry = ({
    session,
    watchlistId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.movieEntries.postEntry(watchlistId), {
        session,
        body,
    });
