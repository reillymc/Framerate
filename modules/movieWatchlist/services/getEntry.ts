import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieEntry } from "@/modules/movieCollection";

type GetEntryRequest = {
    movieId: number;
};

type GetEntry = FramerateService<MovieEntry, GetEntryRequest>;

export const getEntry: GetEntry = ({ movieId, session }) =>
    ExecuteRequest(
        FRAMERATE_API.movieWatchlist.getEntry(movieId),
        // It is expected that a 404 error will be returned if the entry does not exist
        { session, silenceWarnings: [404] },
    );
