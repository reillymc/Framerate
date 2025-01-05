import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type DeleteShowCollectionEntryResponse = {
    count: number;
};

export type DeleteShowCollectionEntryRequest = {
    collectionId: string;
    showId: number;
};

type DeleteShowCollectionEntry = FramerateService<
    DeleteShowCollectionEntryResponse,
    DeleteShowCollectionEntryRequest
>;

export const deleteShowCollectionEntry: DeleteShowCollectionEntry = ({
    collectionId,
    showId,
    session,
}) =>
    ExecuteRequest(
        FRAMERATE_API.showCollections.deleteEntry(collectionId, showId),
        {
            session,
        },
    );
