import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteWatchlistEntryResponse = {
    count: number;
};

export type DeleteWatchlistEntryRequest = {
    mediaId: number;
    mediaType: string;
};

type DeleteWatchlistEntry = FramerateService<
    DeleteWatchlistEntryResponse,
    DeleteWatchlistEntryRequest
>;

export const deleteWatchlistEntry: DeleteWatchlistEntry = ({
    mediaId,
    mediaType,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.deleteWatchlistEntry(mediaType, mediaId),
        { session },
    );
