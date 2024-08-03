import { deleteWatchlistEntry } from "./deleteWatchlistEntry";
import { getWatchlistEntries } from "./getWatchlistEntries";
import { getWatchlistEntry } from "./getWatchlistEntry";
import { saveWatchlistEntry } from "./saveWatchlistEntry";

export const WatchlistEntriesService = {
    getWatchlistEntries,
    getWatchlistEntry,
    saveWatchlistEntry,
    deleteWatchlistEntry,
};

export { WatchlistEntryDetails } from "./getWatchlistEntry";
export { WatchlistEntrySummary } from "./getWatchlistEntries";
export { SaveWatchlistEntryParams } from "./saveWatchlistEntry";
export { DeleteWatchlistEntryParams } from "./deleteWatchlistEntry";
