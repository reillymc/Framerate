import type { Review } from "@/modules/review";
import type { Show } from "@/modules/show";

export type ShowReview = Review & {
    show: Show;
};
