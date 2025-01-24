import { useFramerateServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { CompanyKeys } from "./keys";

export const useCompany = () => {
    const { company } = useFramerateServices();

    return useQuery({
        queryKey: CompanyKeys.list(),
        enabled: !!company,
        // biome-ignore lint/style/noNonNullAssertion: variables guaranteed to be defined by the enabled flag
        queryFn: ({ signal }) => company!.findAll({ signal }),
    });
};
