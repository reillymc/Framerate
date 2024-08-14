import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../services";
import { UserKeys } from "./keys";

export const useUsers = () =>
    useQuery({
        queryKey: UserKeys.list(),
        queryFn: UsersService.getUsers,
    });
