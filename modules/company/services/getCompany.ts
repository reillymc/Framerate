import { FRAMERATE_API, type FramerateService } from "@/constants/api";
import { ExecuteRequest } from "@/helpers/framerateService";
import type { Company } from "../models";

type GetCompany = FramerateService<Company[]>;

export const getCompany: GetCompany = ({ session }) =>
    ExecuteRequest(FRAMERATE_API.company.getCompany(), { session });
