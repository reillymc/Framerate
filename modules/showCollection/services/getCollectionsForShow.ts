import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowCollection, ShowEntry } from "../models";

type GetCollectionsForShowResponse = Array<ShowCollection["collectionId"]>;

type GetCollectionsForShowRequest = Pick<ShowEntry, "showId">;

type GetCollectionsForShow = FramerateService<
    GetCollectionsForShowResponse,
    GetCollectionsForShowRequest
>;

export const getCollectionsForShow: GetCollectionsForShow = ({
    showId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.showCollections.getCollectionsForShow(showId),
        { session },
    );
