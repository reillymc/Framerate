import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Watchlist } from "../models";

type GetWatchlists = FramerateService<Watchlist[]>;

export const getWatchlists: GetWatchlists = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.watchlists.getWatchlists(), { session });
