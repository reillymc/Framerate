import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import type {
    BuildSaveRequest,
    CompanyApiCreateRequest,
    CompanyApiUpdateRequest,
} from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Company } from "../models";
import { CompanyKeys } from "./keys";

type CompanySaveRequest = BuildSaveRequest<
    CompanyApiCreateRequest,
    CompanyApiUpdateRequest,
    never,
    "companyId",
    "saveCompany",
    "saveCompany"
>;

type Context = {
    previousCompanyList?: Company[];
};

export const useSaveCompany = () => {
    const queryClient = useQueryClient();
    const { company } = useFramerateServices();
    const { userId = "" } = useSession();

    return useMutation<Company | null, unknown, CompanySaveRequest, Context>({
        mutationKey: CompanyKeys.mutate,
        mutationFn: ({ companyId, ...params }) =>
            companyId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  company!.update({ companyId, saveCompany: params })
                : // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  company!.create({ saveCompany: params }),

        onError: (error, _, context) => {
            console.warn(error);

            if (!context) return;

            queryClient.setQueryData<Company[]>(
                CompanyKeys.list(),
                context.previousCompanyList,
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.list(),
            });
        },
        onMutate: (params) => {
            const previousCompanyList = queryClient.getQueryData<Company[]>(
                CompanyKeys.list(),
            );

            const companySummary = previousCompanyList?.find(
                (company) => company.companyId === params.companyId,
            );

            if (companySummary) {
                queryClient.setQueryData<Company[]>(
                    CompanyKeys.list(),
                    previousCompanyList?.map((company) =>
                        company.companyId === params.companyId
                            ? {
                                  ...company,
                                  ...params,
                              }
                            : company,
                    ),
                );
            } else {
                queryClient.setQueryData<Company[]>(CompanyKeys.list(), [
                    ...(previousCompanyList ?? []),
                    {
                        ...params,
                        companyId: params.companyId ?? "",
                        createdBy: userId,
                        dateCreated: new Date().toISOString(),
                    } satisfies Company,
                ]);
            }

            return { previousCompanyList };
        },
    });
};
