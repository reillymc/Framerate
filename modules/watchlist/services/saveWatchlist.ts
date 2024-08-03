import { API } from "@/constants/api";

export type SaveWatchlistParams = {
    watchlistId?: string;
    mediaType: string;
    name: string;
};

type SaveWatchlist = (params: SaveWatchlistParams) => Promise<null>;

export const saveWatchlist: SaveWatchlist = async (watchlist) => {
    try {
        const options = {
            method: watchlist.watchlistId ? "PUT" : "POST",
            body: JSON.stringify(watchlist),
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        };

        const response = await fetch(
            watchlist.watchlistId
                ? API.watchlists.putWatchlist(watchlist.watchlistId)
                : API.watchlists.postWatchlist,
            options,
        );

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
};
