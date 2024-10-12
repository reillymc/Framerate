import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Show } from "../models";

type SearchShowsRequest = {
    query: string;
};

type SearchShows = FramerateService<Show[], SearchShowsRequest>;

export const searchShows: SearchShows = ({ query, session }) =>
    ExecuteRequest(FRAMERATE_API.shows.searchShows(query), { session });
