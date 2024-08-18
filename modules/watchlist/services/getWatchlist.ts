import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface WatchlistDetails {
    watchlistId: string;
    userId: string;
    mediaType: string;
    name: string;
}

type GetWatchlistParams = {
    mediaType: string;
};

type GetWatchlist = (
    params: GetWatchlistParams,
) => Promise<WatchlistDetails | undefined>;

export const getWatchlist: GetWatchlist = ({ mediaType }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlist(mediaType));
