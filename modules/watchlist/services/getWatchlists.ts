import { API } from "@/constants/api";

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

export const getWatchlists: GetWatchlists = async () => {
    const response = await fetch(API.watchlists.getWatchlists);
    const json = await response.json();
    return json;
};
