import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type WatchlistEntryDetails = {
    watchlistId: string;
    mediaId: number;
    imdbId?: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
};

type GetWatchlistEntryRequest = {
    mediaType: string;
    mediaId: number;
};

type GetWatchlistEntry = FramerateService<
    WatchlistEntryDetails,
    GetWatchlistEntryRequest
>;

export const getWatchlistEntry: GetWatchlistEntry = ({
    mediaType,
    mediaId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.getWatchlistEntry(mediaType, mediaId),
        // It is expected that a 404 error will be returned if the entry does not exist
        { session, silenceWarnings: [404] },
    );
