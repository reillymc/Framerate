import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type SaveWatchlistResponse = {
    watchlistId: string;
    mediaType: string;
    name: string;
};

export type SaveWatchlistRequest = {
    watchlistId?: string;
    mediaType: string;
    name: string;
};

type SaveWatchlist = FramerateService<
    SaveWatchlistResponse,
    SaveWatchlistRequest
>;

export const saveWatchlist: SaveWatchlist = ({ session, ...watchlist }) =>
    ExecuteRequest(
        FRAMERATE_API.watchlists.saveWatchlist(watchlist.watchlistId),
        { session, body: watchlist },
    );
