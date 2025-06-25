import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFramerateServices } from "@/hooks";
import type { UserApiUpdateRequest } from "@/services";

import type { User } from "../models";
import { UserKeys } from "./keys";

type UserUpdateRequest = Pick<UserApiUpdateRequest, "userId"> &
    UserApiUpdateRequest["updatedUser"];

export const useSaveUser = () => {
    const queryClient = useQueryClient();
    const { users } = useFramerateServices();

    return useMutation<
        User | null,
        unknown,
        UserUpdateRequest,
        { previousUserDetails?: User }
    >({
        mutationKey: UserKeys.mutate,
        mutationFn: ({ userId, ...updatedUser }) =>
            // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
            users!.update({ userId, updatedUser }),
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
        onMutate: (params) => {
            // Snapshot the previous value
            const previousUserDetails = queryClient.getQueryData<User>(
                UserKeys.details(params.userId),
            );

            // Optimistically update to the new value
            if (previousUserDetails) {
                queryClient.setQueryData<User>(
                    UserKeys.details(params.userId),
                    {
                        ...previousUserDetails,
                        ...params,
                    },
                );
            }

            // Return snapshot so we can rollback in case of failure
            return { previousUserDetails };
        },
    });
};
