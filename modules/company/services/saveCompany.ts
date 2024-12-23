import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Company } from "../models";

export type SaveCompanyRequest = {
    userId?: string;
    firstName: string;
    lastName: string;
};

type SaveCompany = FramerateService<Company, SaveCompanyRequest>;

export const saveCompany: SaveCompany = ({ session, ...company }) =>
    ExecuteRequest(FRAMERATE_API.company.saveCompany(company.userId), {
        session,
        body: company,
    });
