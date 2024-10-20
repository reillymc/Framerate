import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteMovieEntryResponse = {
    count: number;
};

export type DeleteMovieEntryRequest = {
    watchlistId: string;
    movieId: number;
};

type DeleteMovieEntry = FramerateService<
    DeleteMovieEntryResponse,
    DeleteMovieEntryRequest
>;

export const deleteMovieEntry: DeleteMovieEntry = ({
    watchlistId,
    movieId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieEntries.deleteEntry(watchlistId, movieId),
        {
            session,
        },
    );
