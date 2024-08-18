import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface WatchlistEntrySummary {
    watchlistId: string;
    mediaId: number;
    imdbId?: string;
    userId: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
}

type GetWatchlistEntriesParams = {
    mediaType: string;
};

type GetWatchlistEntries = (
    params: GetWatchlistEntriesParams,
) => Promise<WatchlistEntrySummary[] | undefined>;

export const getWatchlistEntries: GetWatchlistEntries = ({ mediaType }) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.getWatchlistEntries(mediaType),
    );
