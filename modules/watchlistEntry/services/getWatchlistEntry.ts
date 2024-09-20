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

type GetWatchlistEntryParams = {
    mediaType: string;
    mediaId: number;
};

type GetWatchlistEntry = FramerateService<
    WatchlistEntryDetails,
    GetWatchlistEntryParams
>;

export const getWatchlistEntry: GetWatchlistEntry = ({
    mediaType,
    mediaId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.getWatchlistEntry(mediaType, mediaId),
        { session },
    );
