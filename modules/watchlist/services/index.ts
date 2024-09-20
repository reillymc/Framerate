import { getWatchlist } from "./getWatchlist";
import { getWatchlists } from "./getWatchlists";
import { saveWatchlist } from "./saveWatchlist";

export const WatchlistsService = {
    getWatchlists,
    getWatchlist,
    saveWatchlist,
};

export { WatchlistDetails } from "./getWatchlist";
export { Watchlist } from "./getWatchlists";
export { SaveWatchlistRequest, SaveWatchlistResponse } from "./saveWatchlist";
