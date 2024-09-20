import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type WatchlistDetails = {
    watchlistId: string;
    mediaType: string;
    name: string;
};

type GetWatchlistRequest = {
    mediaType: string;
};

type GetWatchlist = FramerateService<WatchlistDetails, GetWatchlistRequest>;

export const getWatchlist: GetWatchlist = ({ mediaType, session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlist(mediaType), {
        session,
    });
