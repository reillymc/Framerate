import { useFramerateServices } from "@/hooks";
import type { CompanyApiDeleteRequest, DeleteResponse } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Company } from "../models";
import { CompanyKeys } from "./keys";

type Context = {
    previousCompanyList?: Company[];
};

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();
    const { company } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        CompanyApiDeleteRequest,
        Context
    >({
        mutationKey: CompanyKeys.mutate,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        mutationFn: (params) => company!._delete(params),
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

            queryClient.setQueryData<Company[]>(
                CompanyKeys.list(),
                previousCompanyList?.filter(
                    ({ companyId }) => companyId !== params.companyId,
                ),
            );

            return { previousCompanyList };
        },
    });
};
