import { API } from "@/constants/api";

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

export const getWatchlist: GetWatchlist = async ({ mediaType }) => {
    const response = await fetch(API.watchlists.getWatchlist(mediaType));
    const json = await response.json();
    return json;
};
