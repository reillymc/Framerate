import { useFramerateServices } from "@/hooks";
import type { MetaApiUpdateClientConfigRequest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ClientConfig } from "../models";
import { MetaKeys } from "./keys";

export const useSaveClientConfig = () => {
    const queryClient = useQueryClient();
    const { meta } = useFramerateServices();

    return useMutation<
        ClientConfig | null,
        unknown,
        MetaApiUpdateClientConfigRequest,
        { previousEntry?: ClientConfig }
    >({
        mutationFn: ({ clientConfig }) =>
            // biome-ignore lint/style/noNonNullAssertion: service should never be called without authentication
            meta!.updateClientConfig({ clientConfig }),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: MetaKeys.clientConfig }),
        onMutate: ({ clientConfig }) => {
            // Snapshot the previous value
            const previousEntry = queryClient.getQueryData<ClientConfig>(
                MetaKeys.clientConfig,
            );

            // Optimistically update to the new value
            queryClient.setQueryData<ClientConfig>(
                MetaKeys.clientConfig,
                clientConfig,
            );

            // Return snapshot so we can rollback in case of failure
            return { previousEntry };
        },
        onError: (error, _, context) => {
            console.warn(error);
            if (!context) return;

            queryClient.setQueryData<ClientConfig>(
                MetaKeys.clientConfig,
                context.previousEntry,
            );
        },
    });
};
