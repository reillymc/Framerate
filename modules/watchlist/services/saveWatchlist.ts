import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveWatchlistParams = {
    watchlistId?: string;
    mediaType: string;
    name: string;
};

type SaveWatchlist = (params: SaveWatchlistParams) => Promise<null>;

export const saveWatchlist: SaveWatchlist = (watchlist) =>
    ExecuteRequest(
        FRAMERATE_API.watchlists.saveWatchlist(watchlist.watchlistId),
        watchlist,
    );
