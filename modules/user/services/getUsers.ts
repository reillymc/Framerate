import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type UserSummary = {
    userId: string;
    firstName: string;
    lastName: string;
};

type GetUsers = FramerateService<UserSummary[]>;

export const getUsers: GetUsers = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.users.getUsers(), { session });
