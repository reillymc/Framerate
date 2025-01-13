import { useFramerateServices } from "@/hooks";
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
    "userId",
    "saveCompany",
    "saveCompany"
>;

type Context = {
    previousCompanyList?: Company[];
};

export const useSaveCompany = () => {
    const queryClient = useQueryClient();
    const { company } = useFramerateServices();

    return useMutation<Company | null, unknown, CompanySaveRequest, Context>({
        mutationKey: CompanyKeys.mutate,
        mutationFn: ({ userId, ...params }) =>
            userId
                ? // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
                  company!.update({ userId, saveCompany: params })
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
                        dateCreated: new Date(),
                    } satisfies Company,
                ]);
            }

            return { previousCompanyList };
        },
    });
};
