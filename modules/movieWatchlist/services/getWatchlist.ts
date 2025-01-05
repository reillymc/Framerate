import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieWatchlist } from "../models";

type GetWatchlist = FramerateService<MovieWatchlist>;

export const getWatchlist: GetWatchlist = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.movieWatchlist.get(), { session });
