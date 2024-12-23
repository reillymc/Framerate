import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Company } from "../models";
import { CompanyService, type DeleteCompanyRequest } from "../services";
import { CompanyKeys } from "./keys";

export const useDeleteCompany = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        Company | null,
        unknown,
        DeleteCompanyRequest,
        {
            previousCompanyList?: Company[];
        }
    >({
        mutationKey: CompanyKeys.mutate,
        mutationFn: (params) =>
            CompanyService.deleteCompany({ session, ...params }),
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
                    ({ userId }) => userId !== params.userId,
                ),
            );

            return { previousCompanyList };
        },
    });
};
