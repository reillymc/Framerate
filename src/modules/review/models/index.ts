import type { ReviewCompanyDetails } from "@/services";

export type ReviewOrder = "rating" | "date" | "mediaTitle" | "mediaReleaseDate";
export type ReviewSort = "asc" | "desc";
export const AbsoluteRatingScale = 100;

export type Review = {
    reviewId: string;
    date?: string;
    rating?: number;
    title?: string;
    description?: string;
    venue?: string;
    company?: Array<ReviewCompanyDetails>;
};
