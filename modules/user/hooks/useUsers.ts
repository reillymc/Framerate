import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { UserKeys } from "./keys";

export const useUsers = () => {
    const { users } = useFramerateServices();

    return useQuery({
        queryKey: UserKeys.list(),
        enabled: !!users,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => users!.findAll({ signal }),
    });
};
