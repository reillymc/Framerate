import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Company } from "../models";

export type DeleteCompanyRequest = {
    userId: string;
};

type DeleteCompany = FramerateService<Company, DeleteCompanyRequest>;

export const deleteCompany: DeleteCompany = ({ session, userId }) =>
    ExecuteRequest(FRAMERATE_API.company.deleteCompany(userId), { session });
