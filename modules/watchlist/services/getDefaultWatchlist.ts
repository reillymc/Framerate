import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Watchlist } from "../models";

type GetDefaultWatchlistRequest = {
    mediaType: string;
};

type GetDefaultWatchlist = FramerateService<
    Watchlist,
    GetDefaultWatchlistRequest
>;

export const getDefaultWatchlist: GetDefaultWatchlist = ({
    mediaType,
    session,
}) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getDefault(mediaType), {
        session,
    });
