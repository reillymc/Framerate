import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveWatchlistEntryParams = {
    mediaId: number;
    mediaType: string;
};

type SaveWatchlistEntry = (params: SaveWatchlistEntryParams) => Promise<null>;

export const saveWatchlistEntry: SaveWatchlistEntry = (watchlistEntry) =>
    ExecuteRequest(
        FRAMERATE_API.watchlistEntries.postWatchlistEntry(
            watchlistEntry.mediaType,
        ),
        watchlistEntry,
    );
