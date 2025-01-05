import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteEntryResponse = {
    count: number;
};

export type DeleteEntryRequest = {
    showId: number;
};

type DeleteEntry = FramerateService<DeleteEntryResponse, DeleteEntryRequest>;

export const deleteEntry: DeleteEntry = ({ showId, session }) =>
    ExecuteRequest(FRAMERATE_API.showWatchlist.deleteEntry(showId), {
        session,
    });
