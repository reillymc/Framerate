import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Watchlist } from "../models";

type GetWatchlistRequest = {
    mediaType: string;
};

type GetWatchlist = FramerateService<Watchlist, GetWatchlistRequest>;

export const getWatchlist: GetWatchlist = ({ mediaType, session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlist(mediaType), {
        session,
    });
