import { deleteShowEntry } from "./deleteShowEntry";
import { getShowEntries } from "./getShowEntries";
import { getShowEntry } from "./getShowEntry";
import { saveShowEntry } from "./saveShowEntry";

export const ShowEntriesService = {
    getShowEntries,
    getShowEntry,
    saveShowEntry,
    deleteShowEntry,
};

export { SaveShowEntryRequest } from "./saveShowEntry";
export {
    DeleteShowEntryRequest,
    DeleteShowEntryResponse,
} from "./deleteShowEntry";
