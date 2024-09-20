import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type WatchlistEntrySummary = {
    watchlistId: string;
    mediaId: number;
    imdbId?: string;
    mediaType: string;
    mediaTitle: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
};

type GetWatchlistEntriesParams = {
    mediaType: string;
};

type GetWatchlistEntries = FramerateService<
    WatchlistEntrySummary[],
    GetWatchlistEntriesParams
>;

export const getWatchlistEntries: GetWatchlistEntries = ({
    mediaType,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.getWatchlistEntries(mediaType),
        { session },
    );
