import { FRAMERATE_API } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

export type LoginParams = {
    email: string;
    password: string;
};

type Login = (params: LoginParams) => Promise<string>;

export const login: Login = (credentials) =>
    ExecuteRequest(FRAMERATE_API.auth.login(), credentials);
