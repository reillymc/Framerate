import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "@/modules/showCollection";

export type SaveEntryRequest = {
    showId: number;
};

type SaveEntry = FramerateService<ShowEntry, SaveEntryRequest>;

export const saveEntry: SaveEntry = ({ session, ...body }) =>
    ExecuteRequest(FRAMERATE_API.showWatchlist.postEntry(), {
        session,
        body,
    });
