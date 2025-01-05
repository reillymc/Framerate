import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowCollection } from "../models";

export type DeleteShowCollectionResponse = {
    count: number;
};
export type DeleteShowCollectionRequest = Pick<ShowCollection, "collectionId">;

type GetShowCollection = FramerateService<
    DeleteShowCollectionResponse,
    DeleteShowCollectionRequest
>;

export const deleteShowCollection: GetShowCollection = ({
    session,
    ...collection
}) =>
    ExecuteRequest(
        FRAMERATE_API.showCollections.deleteCollection(collection.collectionId),
        { session, body: collection },
    );
