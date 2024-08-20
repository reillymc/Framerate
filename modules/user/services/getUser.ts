import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import { type Configuration, ParseConfiguration } from "../models";

export interface UserDetails {
    userId: string;
    email: string;
    firstName?: string;
    lastName: string;
    configuration: Configuration;
}

type GetUserParams = {
    userId: string;
};

type GetUser = (params: GetUserParams) => Promise<UserDetails | undefined>;

export const getUser: GetUser = ({ userId }) =>
    ExecuteRequest(FRAMERATE_API.users.getUser(userId), undefined, (data) => ({
        ...data,
        configuration: ParseConfiguration(data.configuration),
    }));
