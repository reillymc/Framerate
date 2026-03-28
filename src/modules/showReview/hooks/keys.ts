const baseKey = "showReviews";
export const ShowReviewKeys = {
    base: [baseKey],
    list: (params: unknown) => [baseKey, "infiniteList", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
