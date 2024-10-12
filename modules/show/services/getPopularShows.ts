import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Show } from "../models";

type GetPopularShows = FramerateService<Show[]>;

export const getPopularShows: GetPopularShows = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.shows.getPopularShows(), { session });
