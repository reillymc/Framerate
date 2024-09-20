import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveWatchlistEntryRequest = {
    mediaId: number;
    mediaType: string;
};

export type SaveWatchlistEntryResponse = {
    watchlistId: string;
    mediaId: number;
    imdbId: string;
    mediaType: string;
    mediaTitle?: string;
    mediaPosterUri?: string;
    mediaReleaseDate?: string;
};

type SaveWatchlistEntry = FramerateService<
    SaveWatchlistEntryResponse,
    SaveWatchlistEntryRequest
>;

export const saveWatchlistEntry: SaveWatchlistEntry = ({ session, ...body }) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.postWatchlistEntry(body.mediaType),
        {
            session,
            body,
        },
    );
