import { EmptyState, ScreenLayout } from "@/components";
import {
    SectionedShowEntryList,
    useDeleteShowWatchlistEntry,
    useShowWatchlist,
} from "@/modules/showWatchlist";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";

const Watchlist: FC = () => {
    const router = useRouter();
    const { data: watchlist, isLoading, refetch } = useShowWatchlist();
    const { mutate: deleteEntry } = useDeleteShowWatchlistEntry();

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{ title: watchlist?.name ?? "Loading..." }}
                />
            }
            isLoading={isLoading}
            isEmpty={!watchlist?.entries?.length}
            empty={<EmptyState heading="No shows on watchlist" />}
            loading={<EmptyState heading="Loading..." />}
        >
            <SectionedShowEntryList
                entries={watchlist?.entries ?? []}
                onDeleteEntry={(showId) => deleteEntry({ showId })}
                onPressEntry={(item) =>
                    router.push({
                        pathname: "/shows/show",
                        params: {
                            id: item.showId,
                            name: item.name,
                            posterPath: item.posterPath,
                        },
                    })
                }
                onAddReview={(showId) =>
                    router.push({
                        pathname: "/shows/editWatch",
                        params: { showId },
                    })
                }
                onRefresh={refetch}
            />
        </ScreenLayout>
    );
};

export default Watchlist;
