import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowCollection } from "../models";

export type SaveShowCollectionRequest = Pick<ShowCollection, "name"> &
    Partial<Pick<ShowCollection, "collectionId">>;

type GetShowCollection = FramerateService<
    ShowCollection,
    SaveShowCollectionRequest
>;

export const saveShowCollection: GetShowCollection = ({
    session,
    ...collection
}) =>
    ExecuteRequest(
        FRAMERATE_API.showCollections.saveCollection(collection.collectionId),
        { session, body: collection },
    );
