import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";

type LoginResponse = {
    token: string;
    userId: string;
};

export type LoginRequest = {
    email: string;
    password: string;
};

type Login = FramerateService<LoginResponse, LoginRequest>;

export const login: Login = ({ session, ...body }) =>
    ExecuteRequest(FRAMERATE_API.auth.login(), { session, body });
