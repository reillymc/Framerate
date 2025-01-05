import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteEntryResponse = {
    count: number;
};

export type DeleteEntryRequest = {
    movieId: number;
};

type DeleteEntry = FramerateService<DeleteEntryResponse, DeleteEntryRequest>;

export const deleteEntry: DeleteEntry = ({ movieId, session }) =>
    ExecuteRequest(FRAMERATE_API.movieWatchlist.deleteEntry(movieId), {
        session,
    });
