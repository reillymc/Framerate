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
export {
    SaveWatchlistEntryRequest,
    SaveWatchlistEntryResponse,
} from "./saveWatchlistEntry";
export {
    DeleteWatchlistEntryRequest,
    DeleteWatchlistEntryResponse,
} from "./deleteWatchlistEntry";
