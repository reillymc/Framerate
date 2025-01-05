import { deleteEntry } from "./deleteEntry";
import { getEntry } from "./getEntry";
import { getWatchlist } from "./getWatchlist";
import { saveEntry } from "./saveEntry";

export const MovieWatchlistService = {
    getWatchlist,
    getEntry,
    deleteEntry,
    saveEntry,
};

export { SaveEntryRequest } from "./saveEntry";
export { DeleteEntryRequest, DeleteEntryResponse } from "./deleteEntry";
