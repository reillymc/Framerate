import { deleteShowCollection } from "./deleteShowCollection";
import { deleteShowCollectionEntry } from "./deleteShowCollectionEntry";
import { getCollectionsForShow } from "./getCollectionsForShow";
import { getShowCollection } from "./getShowCollection";
import { getShowCollections } from "./getShowCollections";
import { saveShowCollectionEntry } from "./saveShowCollectionEntry";
import { saveShowCollection } from "./saveShowCollections";

export const ShowCollectionService = {
    deleteShowCollectionEntry,
    deleteShowCollection,
    getCollectionsForShow,
    getShowCollection,
    getShowCollections,
    saveShowCollection,
    saveShowCollectionEntry,
};

export { SaveShowCollectionRequest } from "./saveShowCollections";
export { SaveShowCollectionEntryRequest } from "./saveShowCollectionEntry";
export {
    DeleteShowCollectionEntryRequest,
    DeleteShowCollectionEntryResponse,
} from "./deleteShowCollectionEntry";
export {
    DeleteShowCollectionRequest,
    DeleteShowCollectionResponse,
} from "./deleteShowCollection";
