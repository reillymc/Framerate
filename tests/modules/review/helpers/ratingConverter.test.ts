import {
    getRatingLabel,
    ratingToStars,
} from "@/modules/review/helpers/ratingConverter";
import { AbsoluteRatingScale } from "@/modules/review/models";

describe("ratingConverter helpers", () => {
    describe("ratingToStars", () => {
        test.each([
            [0, 5, 0],
            [50, 5, 2.5],
            [100, 5, 5],
            [20, 5, 1],
        ])("ratingToStars(%i, %i) => %p", (rating, starCount, expected) => {
            expect(ratingToStars(rating, starCount)).toBe(expected);
        });
    });

    describe("getRatingLabel", () => {
        test.each([
            [AbsoluteRatingScale / 5, 5, "1 Star"],
            [50, 5, "2.5 Stars"],
            [0, 5, "0 Stars"],
            [AbsoluteRatingScale, 10, "10 Stars"],
            [-1, 5, "No Rating"],
        ])("getRatingLabel(%i, %i) => %p", (rating, starCount, expected) => {
            expect(getRatingLabel(rating, starCount)).toBe(expected);
        });
    });
});
