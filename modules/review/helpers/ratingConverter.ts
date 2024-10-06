import { AbsoluteRatingScale } from "../constants";

export const ratingToStars = (rating: number, starCount: number): number =>
    (rating / AbsoluteRatingScale) * starCount;

export const starsToRating = (stars: number, starCount: number): number =>
    (stars * AbsoluteRatingScale) / starCount;

export const getRatingLabel = (rating: number, starCount: number) =>
    `${ratingToStars(rating, starCount)} Star${rating === AbsoluteRatingScale / starCount ? "" : "s"}`;
