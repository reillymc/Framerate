import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { MovieCollection } from "../models";

type GetMovieCollectionRequest = {
    collectionId: string;
};

type GetMovieCollection = FramerateService<
    MovieCollection,
    GetMovieCollectionRequest
>;

export const getMovieCollection: GetMovieCollection = ({
    collectionId,
    session,
}) =>
    ExecuteRequest(FRAMERATE_API.movieCollections.getCollection(collectionId), {
        session,
    });
