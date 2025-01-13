import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { UserKeys } from "./keys";

export const useUser = (userId: string | undefined) => {
    const { users } = useFramerateServices();

    return useQuery({
        queryKey: UserKeys.details(userId),
        enabled: !!users && !!userId,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => users!.find({ userId: userId! }),
    });
};
