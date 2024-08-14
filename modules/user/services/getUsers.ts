import { API } from "@/constants/api";

export interface UserSummary {
    userId: string;
    firstName: string;
    lastName: string;
}

type GetUsers = () => Promise<UserSummary[] | undefined>;

export const getUsers: GetUsers = async () => {
    const response = await fetch(API.users.getUsers());
    const json = await response.json();
    return json;
};
