import { useFramerateServices } from "@/hooks";
import type { DeleteResponse, UserApiDeleteRequest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "../models";
import { UserKeys } from "./keys";

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    const { users } = useFramerateServices();

    return useMutation<
        DeleteResponse | null,
        unknown,
        UserApiDeleteRequest,
        { previousUserDetails?: User }
    >({
        mutationKey: UserKeys.mutate,
        // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
        mutationFn: ({ userId }) => users!._delete({ userId }),
        onMutate: (params) => {
            // Snapshot the previous value
            const previousUserDetails = queryClient.getQueryData<User>(
                UserKeys.details(params.userId),
            );

            // Optimistically update to the new value
            if (previousUserDetails) {
                queryClient.setQueryData<User>(
                    UserKeys.details(params.userId),
                    undefined,
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousUserDetails };
        },
        onError: (error, params, context) => {
            console.warn(error);

            if (!context) return;

            queryClient.setQueryData<User>(
                UserKeys.details(params.userId),
                context.previousUserDetails,
            );
        },
        onSuccess: (_response, params) => {
            queryClient.invalidateQueries({
                queryKey: UserKeys.details(params.userId),
            });
            queryClient.invalidateQueries({
                queryKey: UserKeys.list(),
            });
        },
    });
};
