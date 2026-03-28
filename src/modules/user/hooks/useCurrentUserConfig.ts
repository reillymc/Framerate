import { useSession } from "@/modules/auth";

import { DefaultConfiguration } from "../models";
import { useUser } from "./useUser";

export const useCurrentUserConfig = () => {
    const { userId } = useSession();

    const { data } = useUser(userId);

    return { configuration: data?.configuration ?? DefaultConfiguration };
};
