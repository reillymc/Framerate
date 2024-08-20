const baseKey = "reviews";
export const ReviewKeys = {
    mutate: [baseKey],
    list: (mediaId: number | undefined) => [baseKey, "list", mediaId],
    details: (reviewId: string | undefined) => [baseKey, "details", reviewId],
};
