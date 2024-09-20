import { useSession } from "@/modules/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    type SaveUserRequest,
    type SaveUserResponse,
    type UserDetails,
    type UserSummary,
    UsersService,
} from "../services";
import { UserKeys } from "./keys";

export const useSaveUser = () => {
    const queryClient = useQueryClient();
    const { session } = useSession();

    return useMutation<
        SaveUserResponse | null,
        unknown,
        SaveUserRequest,
        { previousUserDetails?: UserDetails; previousUsersList?: UserSummary[] }
    >({
        mutationKey: UserKeys.mutate,
        mutationFn: (params) => UsersService.saveUser({ session, ...params }),
        onError: (error, params, context) => {
            console.warn(error);

            if (!context) return;

            queryClient.setQueryData<UserDetails>(
                UserKeys.details(params.userId),
                context.previousUserDetails,
            );

            queryClient.setQueryData<UserSummary[]>(
                UserKeys.list(),
                context.previousUsersList,
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
            const previousUserDetails = queryClient.getQueryData<UserDetails>(
                UserKeys.details(params.userId),
            );

            // Optimistically update to the new value
            if (previousUserDetails) {
                queryClient.setQueryData<UserDetails>(
                    UserKeys.details(params.userId),
                    {
                        ...previousUserDetails,
                        ...params,
                    },
                );
            }

            const previousUsersList = queryClient.getQueryData<UserSummary[]>(
                UserKeys.list(),
            );

            const userSummary = previousUsersList?.find(
                (user) => user.userId === params.userId,
            );

            if (userSummary) {
                queryClient.setQueryData<UserSummary[]>(
                    UserKeys.list(),
                    previousUsersList?.map((user) =>
                        user.userId === params.userId
                            ? {
                                  ...user,
                                  ...params,
                              }
                            : user,
                    ),
                );
            } else {
                queryClient.setQueryData<UserSummary[]>(UserKeys.list(), [
                    ...(previousUsersList ?? []),
                    {
                        ...params,
                        userId: params.userId ?? "",
                        firstName: params.firstName ?? "",
                        lastName: params.lastName ?? "",
                    },
                ]);
            }

            // Return snapshot so we can rollback in case of failure
            return { previousUserDetails, previousUsersList };
        },
    });
};
