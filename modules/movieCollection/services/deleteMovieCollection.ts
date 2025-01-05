import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieCollection } from "../models";

export type DeleteMovieCollectionResponse = {
    count: number;
};
export type DeleteMovieCollectionRequest = Pick<
    MovieCollection,
    "collectionId"
>;

type GetMovieCollection = FramerateService<
    DeleteMovieCollectionResponse,
    DeleteMovieCollectionRequest
>;

export const deleteMovieCollection: GetMovieCollection = ({
    session,
    ...collection
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieCollections.deleteCollection(
            collection.collectionId,
        ),
        { session, body: collection },
    );
