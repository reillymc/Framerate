import type { Review } from "@/modules/review";
import type { Season } from "@/modules/season";

export type SeasonReview = Review & {
    season: Season;
};
