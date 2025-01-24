import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ParseConfiguration } from "../models";
import { UserKeys } from "./keys";

export const useUser = (userId: string | undefined) => {
    const { users } = useFramerateServices();

    return useQuery({
        queryKey: UserKeys.details(userId),
        enabled: !!users && !!userId,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => users!.find({ userId: userId! }, { signal }),
        select: (data) => ({
            ...data,
            configuration: ParseConfiguration(data.configuration),
        }),
    });
};
