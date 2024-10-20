import { deleteMovieEntry } from "./deleteMovieEntry";
import { getMovieEntries } from "./getMovieEntries";
import { getMovieEntry } from "./getMovieEntry";
import { saveMovieEntry } from "./saveMovieEntry";

export const MovieEntriesService = {
    getMovieEntries,
    getMovieEntry,
    saveMovieEntry,
    deleteMovieEntry,
};

export { SaveMovieEntryRequest } from "./saveMovieEntry";
export {
    DeleteMovieEntryRequest,
    DeleteMovieEntryResponse,
} from "./deleteMovieEntry";
