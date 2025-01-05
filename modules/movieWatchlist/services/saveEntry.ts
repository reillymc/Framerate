import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "@/modules/movieCollection";

export type SaveEntryRequest = {
    movieId: number;
};

type SaveEntry = FramerateService<MovieEntry, SaveEntryRequest>;

export const saveEntry: SaveEntry = ({ session, ...body }) =>
    ExecuteRequest(FRAMERATE_API.movieWatchlist.postEntry(), {
        session,
        body,
    });
