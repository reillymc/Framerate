import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "@/modules/showCollection";

type GetEntryRequest = {
    showId: number;
};

type GetEntry = FramerateService<ShowEntry, GetEntryRequest>;

export const getEntry: GetEntry = ({ showId, session }) =>
    ExecuteRequest(
        FRAMERATE_API.showWatchlist.getEntry(showId),
        // It is expected that a 404 error will be returned if the entry does not exist
        { session, silenceWarnings: [404] },
    );
