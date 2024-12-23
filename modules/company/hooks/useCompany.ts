import { useSession } from "@/modules/auth";
import { useQuery } from "@tanstack/react-query";
import { CompanyService } from "../services";
import { CompanyKeys } from "./keys";

export const useCompany = () => {
    const { session } = useSession();

    return useQuery({
        queryKey: CompanyKeys.list(),
        queryFn: () => CompanyService.getCompany({ session }),
        select: (data) => data ?? undefined,
    });
};
