import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import { type Configuration, ParseConfiguration } from "../models";

export type SaveUserResponse = {
    userId: string;
    email?: string;
    firstName: string;
    lastName: string;
    avatarUri?: string;
    dateCreated: Date;
    permissionLevel: number;
    configuration: Configuration;
};

export type SaveUserRequest = {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    configuration?: Configuration;
};

type SaveUser = FramerateService<SaveUserResponse, SaveUserRequest>;

export const saveUser: SaveUser = ({ session, ...user }) =>
    ExecuteRequest(FRAMERATE_API.users.saveUser(user.userId), {
        session,
        body: user,
        processor: (data) => ({
            ...data,
            configuration: ParseConfiguration(data.configuration),
        }),
    });
