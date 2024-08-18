import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteWatchlistEntryParams = {
    mediaId: number;
    mediaType: string;
};

type DeleteWatchlistEntry = (
    params: DeleteWatchlistEntryParams,
) => Promise<null>;

export const deleteWatchlistEntry: DeleteWatchlistEntry = ({
    mediaId,
    mediaType,
}) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.deleteWatchlistEntry(mediaType, mediaId),
    );
