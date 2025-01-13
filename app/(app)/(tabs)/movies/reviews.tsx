import { MediaType } from "@/constants/mediaTypes";
import { useCompany } from "@/modules/company";
import { useMovieReviews } from "@/modules/movieReview";
import {
    AbsoluteRatingScale,
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSortButton,
    ReviewSummaryCard,
} from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";
import { Undefined } from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import { type FC, useMemo, useState } from "react";

const Reviews: FC = () => {
    const [atVenue, setAtVenue] = useState<string | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [withCompany, setWithCompany] = useState<string | undefined>(
        undefined,
    );
    const [orderBy, setOrderBy] = useState<ReviewOrder>("date");
    const [sort, setSort] = useState<ReviewSort>("desc");

    const router = useRouter();

    const { configuration } = useCurrentUserConfig();

    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useMovieReviews({
        atVenue,
        withCompany,
        ratingMax:
            rating !== undefined
                ? rating +
                  AbsoluteRatingScale / configuration.ratings.starCount -
                  1
                : undefined,
        ratingMin: rating,
        sort,
        orderBy,
    });

    const { data: company = [] } = useCompany();

    const reviewList = useMemo(
        () => reviews?.pages?.flat().filter(Undefined),
        [reviews],
    );

    const selectedCompany = useMemo(
        () => company.find(({ companyId }) => companyId === withCompany),
        [company, withCompany],
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Reviews",
                    headerRight: () =>
                        reviewList?.length ||
                        withCompany ||
                        atVenue ||
                        rating ? (
                            <ReviewSortButton
                                order={orderBy}
                                sort={sort}
                                mediaType={MediaType.Movie}
                                onChangeOrder={setOrderBy}
                                onChangeSort={setSort}
                            />
                        ) : undefined,
                }}
            />
            <FilterableReviewList
                reviews={reviewList}
                venueOptions={configuration.venues.knownVenueNames}
                starCount={configuration.ratings.starCount}
                companyOptions={company}
                filters={{
                    company: selectedCompany,
                    rating,
                    venue: atVenue,
                    onChangeCompany: setWithCompany,
                    onChangeRating: setRating,
                    onChangeVenue: setAtVenue,
                }}
                onRefresh={refetch}
                onFetchNextPage={() => fetchNextPage()}
                renderItem={({ item }) => (
                    <ReviewSummaryCard
                        key={item.reviewId}
                        review={item}
                        mediaTitle={item.movie.title}
                        mediaPosterPath={item.movie.posterPath}
                        mediaDate={item.movie.releaseDate}
                        starCount={configuration.ratings.starCount}
                        onPress={() =>
                            router.push({
                                pathname: "/movies/movie",
                                params: {
                                    id: item.movie.id,
                                    title: item.movie.title,
                                    posterPath: item.movie.posterPath,
                                },
                            })
                        }
                        onOpenReview={() =>
                            router.push({
                                pathname: "/movies/review",
                                params: { reviewId: item.reviewId },
                            })
                        }
                    />
                )}
            />
        </>
    );
};

export default Reviews;
