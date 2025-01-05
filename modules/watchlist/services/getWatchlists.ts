import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Watchlist } from "../models";

type GetWatchlistsRequest = {
    mediaType: string;
};

type GetWatchlists = FramerateService<Watchlist[], GetWatchlistsRequest>;

export const getWatchlists: GetWatchlists = ({ mediaType, session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlists(mediaType), {
        session,
    });
