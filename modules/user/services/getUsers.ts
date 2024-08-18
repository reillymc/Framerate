import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export interface UserSummary {
    userId: string;
    firstName: string;
    lastName: string;
}

type GetUsers = () => Promise<UserSummary[] | undefined>;

export const getUsers: GetUsers = () =>
    ExecuteRequest(FRAMERATE_API.users.getUsers());
