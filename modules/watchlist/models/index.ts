import type { User } from "@/modules/user";

export type Watchlist = {
    watchlistId: string;
    mediaType: string;
    name: string;
    userId: User["id"];
};
