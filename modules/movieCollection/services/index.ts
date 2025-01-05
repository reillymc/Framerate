import { deleteMovieCollection } from "./deleteMovieCollection";
import { deleteMovieCollectionEntry } from "./deleteMovieCollectionEntry";
import { getCollectionsForMovie } from "./getCollectionsForMovie";
import { getMovieCollection } from "./getMovieCollection";
import { getMovieCollections } from "./getMovieCollections";
import { saveMovieCollectionEntry } from "./saveMovieCollectionEntry";
import { saveMovieCollection } from "./saveMovieCollections";

export const MovieCollectionService = {
    deleteMovieCollectionEntry,
    deleteMovieCollection,
    getCollectionsForMovie,
    getMovieCollection,
    getMovieCollections,
    saveMovieCollection,
    saveMovieCollectionEntry,
};

export { SaveMovieCollectionRequest } from "./saveMovieCollections";
export { SaveMovieCollectionEntryRequest } from "./saveMovieCollectionEntry";
export {
    DeleteMovieCollectionEntryRequest,
    DeleteMovieCollectionEntryResponse,
} from "./deleteMovieCollectionEntry";
export {
    DeleteMovieCollectionRequest,
    DeleteMovieCollectionResponse,
} from "./deleteMovieCollection";
