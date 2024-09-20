import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../services";
import { UserKeys } from "./keys";

export const useUser = (userId: string | undefined) => {
    const { session } = useSession();

    return useQuery({
        queryKey: UserKeys.details(userId),
        enabled: !!userId,
        queryFn: () =>
            UsersService.getUser({
                // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
                userId: userId!,
                session,
            }),
    });
};
