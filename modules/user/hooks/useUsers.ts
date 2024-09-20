import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../services";
import { UserKeys } from "./keys";

export const useUsers = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: UserKeys.list(),
        queryFn: () => UsersService.getUsers({ session }),
        select: (data) => data ?? undefined,
    });
};
