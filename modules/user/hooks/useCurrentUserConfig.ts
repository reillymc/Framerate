import { useFramerateServices } from "@/hooks";
import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { type Configuration, DefaultConfiguration } from "../models";
import { UserKeys } from "./keys";

export const useCurrentUserConfig = () => {
    const { userId } = useSession();
    const { users } = useFramerateServices();

    const { data } = useQuery({
        queryKey: UserKeys.details(userId),
        enabled: !!users && !!userId,
        // biome-ignore lint/style/noNonNullAssertion: userId is guaranteed to be defined by the enabled flag
        queryFn: () => users!.find({ userId: userId! }),
        select: (data) => data?.configuration as Configuration,
    });

    return { configuration: data ?? DefaultConfiguration };
};
