import { AbsoluteRatingScale } from "../models";

export const ratingToStars = (rating: number, starCount: number): number => {
    "worklet";
    return (rating / AbsoluteRatingScale) * starCount;
};

export const starsToRating = (stars: number, starCount: number): number => {
    "worklet";
    return (stars * AbsoluteRatingScale) / starCount;
};

export const getRatingLabel = (rating: number, starCount: number) =>
    rating >= 0
        ? `${ratingToStars(rating, starCount)} Star${rating === AbsoluteRatingScale / starCount ? "" : "s"}`
        : "No Rating";
