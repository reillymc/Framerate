import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface WatchlistEntryDetails {
    watchlistId: string;
    mediaId: number;
    imdbId?: string;
    userId: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
}

type GetWatchlistEntryParams = {
    mediaType: string;
    mediaId: number;
};

type GetWatchlistEntry = (
    params: GetWatchlistEntryParams,
) => Promise<WatchlistEntryDetails | undefined>;

export const getWatchlistEntry: GetWatchlistEntry = ({ mediaType, mediaId }) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.getWatchlistEntry(mediaType, mediaId),
    );
