import { API } from "@/constants/api";
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

export const saveUser: SaveUser = async (user) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    const options = {
        method: user.userId ? "PUT" : "POST",
        body: JSON.stringify(user),
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        signal: controller.signal,
    };

    const response = await fetch(
        user.userId ? API.users.putUser(user.userId) : API.users.postUser(),
        options,
    );

    return response.json();
};
