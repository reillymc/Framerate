import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieCollection } from "../models";

export type SaveMovieCollectionRequest = Pick<MovieCollection, "name"> &
    Partial<Pick<MovieCollection, "collectionId">>;

type GetMovieCollection = FramerateService<
    MovieCollection,
    SaveMovieCollectionRequest
>;

export const saveMovieCollection: GetMovieCollection = ({
    session,
    ...collection
}) =>
    ExecuteRequest(
        FRAMERATE_API.movieCollections.saveCollection(collection.collectionId),
        { session, body: collection },
    );
