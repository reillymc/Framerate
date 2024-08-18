const baseKey = "reviews";
export const ReviewKeys = {
    mutate: [baseKey],
    list: (mediaId: number | undefined) => [baseKey, mediaId],
    details: (reviewId: string | undefined) => [baseKey, reviewId],
};
