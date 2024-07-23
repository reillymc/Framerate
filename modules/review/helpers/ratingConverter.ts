export const ratingToStars = (rating: number): number => {
    return rating / 10;
};

export const starsToRating = (stars: number): number => {
    return stars * 10;
};
