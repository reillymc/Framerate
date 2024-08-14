import { API } from "@/constants/api";
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

export const getUser: GetUser = async ({ userId }) => {
    const response = await fetch(API.users.getUser(userId));
    const json = await response.json();
    return {
        ...json,
        configuration: ParseConfiguration(json.configuration),
    };
};
