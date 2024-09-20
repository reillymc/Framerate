import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import { type Configuration, ParseConfiguration } from "../models";

export type UserDetails = {
    userId: string;
    email: string;
    firstName?: string;
    lastName: string;
    configuration: Configuration;
};

type GetUserRequest = {
    userId: string;
};

type GetUser = FramerateService<UserDetails, GetUserRequest>;

export const getUser: GetUser = ({ userId, session }) =>
    ExecuteRequest(FRAMERATE_API.users.getUser(userId), {
        session,
        processor: (data) => ({
            ...data,
            configuration: ParseConfiguration(data.configuration),
        }),
    });
