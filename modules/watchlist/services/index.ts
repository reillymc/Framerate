import { getWatchlist } from "./getWatchlist";
import { getWatchlists } from "./getWatchlists";
import { saveWatchlist } from "./saveWatchlist";

export const WatchlistsService = {
    getWatchlists,
    getWatchlist,
    saveWatchlist,
};

export { SaveWatchlistRequest, SaveWatchlistResponse } from "./saveWatchlist";
