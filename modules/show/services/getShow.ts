import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Show } from "../models";

type GetShowRequest = {
    id: number;
};

type GetShow = FramerateService<Show, GetShowRequest>;

export const getShow: GetShow = ({ id, session }) =>
    ExecuteRequest(FRAMERATE_API.shows.getShow(id), { session });
