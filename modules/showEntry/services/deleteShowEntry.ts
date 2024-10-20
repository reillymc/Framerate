import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteShowEntryResponse = {
    count: number;
};

export type DeleteShowEntryRequest = {
    watchlistId: string;
    showId: number;
};

type DeleteShowEntry = FramerateService<
    DeleteShowEntryResponse,
    DeleteShowEntryRequest
>;

export const deleteShowEntry: DeleteShowEntry = ({
    watchlistId,
    showId,
    session,
}) =>
    ExecuteRequest(FRAMERATE_API.showEntries.deleteEntry(watchlistId, showId), {
        session,
    });
