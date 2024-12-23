import { deleteCompany } from "./deleteCompany";
import { getCompany } from "./getCompany";
import { saveCompany } from "./saveCompany";

export const CompanyService = {
    deleteCompany,
    getCompany,
    saveCompany,
};

export { SaveCompanyRequest } from "./saveCompany";
export { DeleteCompanyRequest } from "./deleteCompany";
