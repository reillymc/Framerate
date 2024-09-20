import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type Watchlist = {
    watchlistId: string;
    mediaType: string;
    name: string;
};

type GetWatchlists = FramerateService<Watchlist[]>;

export const getWatchlists: GetWatchlists = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlists(), { session });
