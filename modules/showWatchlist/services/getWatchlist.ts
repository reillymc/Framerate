import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowWatchlist } from "../models";

type GetWatchlist = FramerateService<ShowWatchlist>;

export const getWatchlist: GetWatchlist = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.showWatchlist.get(), { session });
