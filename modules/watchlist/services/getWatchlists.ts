import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface Watchlist {
    watchlistId: string;
    userId: string;
    mediaType: string;
    name: string;
}

type GetWatchlistParams = never;

type GetWatchlists = (
    params: GetWatchlistParams,
) => Promise<Watchlist[] | undefined>;

export const getWatchlists: GetWatchlists = () =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlists());
