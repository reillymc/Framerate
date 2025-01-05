import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Watchlist } from "../models";

type GetWatchlistRequest = {
    watchlistId: string;
};

type GetWatchlist = FramerateService<Watchlist, GetWatchlistRequest>;

export const getWatchlist: GetWatchlist = ({ watchlistId, session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlist(watchlistId), {
        session,
    });
