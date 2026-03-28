import type { FC } from "react";
import { Link, Stack, useRouter } from "expo-router";

import {
    SectionedShowEntryList,
    useDeleteShowWatchlistEntry,
    useShowWatchlist,
} from "@/modules/showWatchlist";

import { EmptyState, ScreenLayout } from "@/components";

const Watchlist: FC = () => {
    const router = useRouter();
    const { data: watchlist, isLoading, refetch } = useShowWatchlist();
    const { mutate: deleteEntry } = useDeleteShowWatchlistEntry();

    return (
        <ScreenLayout
            meta={
                <Stack.Screen
                    options={{
                        title: watchlist?.name ?? "Loading...",
                        scrollEdgeEffects: {
                            top: "hard",
                        },
                    }}
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
                renderItem={({ item, children }) => (
                    <Link
                        href={{
                            pathname: "/shows/show",
                            params: {
                                id: item.showId,
                                name: item.name,
                                posterPath: item.posterPath,
                            },
                        }}
                        asChild
                    >
                        <Link.Menu title="Menu">
                            <Link.MenuAction
                                title="Add Watch"
                                onPress={() =>
                                    router.push({
                                        pathname: "/shows/editWatch",
                                        params: {
                                            showId: item.showId,
                                        },
                                    })
                                }
                                icon="plus"
                            />
                            <Link.MenuAction
                                title="Remove from Watchlist"
                                onPress={() =>
                                    deleteEntry({
                                        showId: item.showId,
                                    })
                                }
                                icon="eye.slash"
                            />
                        </Link.Menu>
                        <Link.Trigger>{children}</Link.Trigger>
                    </Link>
                )}
                onRefresh={refetch}
            />
        </ScreenLayout>
    );
};

export default Watchlist;
