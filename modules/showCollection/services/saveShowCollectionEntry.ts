import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowEntry } from "../models";

export type SaveShowCollectionEntryRequest = {
    collectionId: string;
    showId: number;
};

type SaveShowCollectionEntry = FramerateService<
    ShowEntry,
    SaveShowCollectionEntryRequest
>;

export const saveShowCollectionEntry: SaveShowCollectionEntry = ({
    session,
    collectionId,
    ...body
}) =>
    ExecuteRequest(FRAMERATE_API.showCollections.postEntry(collectionId), {
        session,
        body,
    });
