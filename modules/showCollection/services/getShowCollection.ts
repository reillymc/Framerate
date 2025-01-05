import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowCollection } from "../models";

type GetShowCollectionRequest = {
    collectionId: string;
};

type GetShowCollection = FramerateService<
    ShowCollection,
    GetShowCollectionRequest
>;

export const getShowCollection: GetShowCollection = ({
    collectionId,
    session,
}) =>
    ExecuteRequest(FRAMERATE_API.showCollections.getCollection(collectionId), {
        session,
    });
