import { getDefaultWatchlist } from "./getDefaultWatchlist";
import { getWatchlist } from "./getWatchlist";
import { getWatchlists } from "./getWatchlists";
import { saveWatchlist } from "./saveWatchlist";

export const WatchlistsService = {
    getDefaultWatchlist,
    getWatchlist,
    getWatchlists,
    saveWatchlist,
};

export { SaveWatchlistRequest, SaveWatchlistResponse } from "./saveWatchlist";
