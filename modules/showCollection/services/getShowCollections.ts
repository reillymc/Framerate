import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { ShowCollection } from "../models";

type GetShowCollections = FramerateService<ShowCollection[]>;

export const getShowCollections: GetShowCollections = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.showCollections.getCollections(), { session });
