import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveWatchlistEntryParams = {
    mediaId: number;
    mediaType: string;
    imdbId: string | undefined;
    mediaTitle: string;
    mediaPosterUri: string | undefined;
    mediaReleaseDate: string | undefined;
};

type SaveWatchlistEntry = (params: SaveWatchlistEntryParams) => Promise<null>;

export const saveWatchlistEntry: SaveWatchlistEntry = (watchlistEntry) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.postWatchlistEntry(
            watchlistEntry.mediaType,
        ),
        watchlistEntry,
    );
