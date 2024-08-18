import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Configuration } from "../models";

export type SaveUserParams = {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    configuration?: Configuration;
};

type SaveUser = (params: SaveUserParams) => Promise<null>;

export const saveUser: SaveUser = (user) =>
    ExecuteRequest(FRAMERATE_API.users.saveUser(user.userId), user);
