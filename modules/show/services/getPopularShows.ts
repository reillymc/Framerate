import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowSearchResult } from "./searchShows";

type GetPopularShows = FramerateService<ShowSearchResult[]>;

export const getPopularShows: GetPopularShows = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.shows.getPopularShows(), { session });
