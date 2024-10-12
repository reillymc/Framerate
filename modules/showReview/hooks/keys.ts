const baseKey = "showReviews";
export const ReviewKeys = {
    base: [baseKey],
    list: (params: unknown) => [baseKey, "infiniteList", params],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
