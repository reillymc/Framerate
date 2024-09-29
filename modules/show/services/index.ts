import { getPopularShows } from "./getPopularShows";
import { getShow } from "./getShow";
import { searchShows } from "./searchShows";

export const ShowsService = {
    getShow,
    getPopularShows,
    searchShows,
};

export { ShowDetails } from "./getShow";
export { ShowSearchResult } from "./searchShows";
