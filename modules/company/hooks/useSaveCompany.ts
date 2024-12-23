import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Company } from "../models";
import { CompanyService, type SaveCompanyRequest } from "../services";
import { CompanyKeys } from "./keys";

export const useSaveCompany = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        Company | null,
        unknown,
        SaveCompanyRequest,
        {
            previousCompanyList?: Company[];
        }
    >({
        mutationKey: CompanyKeys.mutate,
        mutationFn: (params) =>
            CompanyService.saveCompany({ session, ...params }),
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
                (company) => company.userId === params.userId,
            );

            if (companySummary) {
                queryClient.setQueryData<Company[]>(
                    CompanyKeys.list(),
                    previousCompanyList?.map((company) =>
                        company.userId === params.userId
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
                        userId: params.userId ?? "",
                    },
                ]);
            }

            return { previousCompanyList };
        },
    });
};
