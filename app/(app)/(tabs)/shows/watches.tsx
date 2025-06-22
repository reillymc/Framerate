import { MediaType } from "@/constants/mediaTypes";
import { useCompany } from "@/modules/company";
import {
    AbsoluteRatingScale,
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSortButton,
    ReviewSummaryCard,
} from "@/modules/review";
import { useShowReviews } from "@/modules/showReview";
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

    const ratingMax = useMemo(() => {
        if (rating === undefined) return undefined;

        if (rating === -1) return -1;

        return (
            rating + AbsoluteRatingScale / configuration.ratings.starCount - 1
        );
    }, [rating, configuration.ratings.starCount]);

    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useShowReviews({
        atVenue,
        withCompany,
        ratingMax,
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
                    title: "My Watches",
                    headerRight: () => (
                        <ReviewSortButton
                            order={orderBy}
                            sort={sort}
                            mediaType={MediaType.Show}
                            onChangeOrder={setOrderBy}
                            onChangeSort={setSort}
                        />
                    ),
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
                order={orderBy}
                sort={sort}
                onChangeOrder={setOrderBy}
                mediaType={MediaType.Movie}
                onChangeSort={setSort}
                onRefresh={refetch}
                onFetchNextPage={() => fetchNextPage()}
                renderItem={({ item }) => (
                    <ReviewSummaryCard
                        key={item.reviewId}
                        review={item}
                        mediaTitle={item.show.name}
                        mediaPosterPath={item.show.posterPath}
                        mediaDate={item.show.firstAirDate}
                        starCount={configuration.ratings.starCount}
                        onPress={() =>
                            router.push({
                                pathname: "/shows/show",
                                params: {
                                    id: item.show.id,
                                    name: item.show.name,
                                    posterPath: item.show.posterPath,
                                },
                            })
                        }
                        onOpenReview={() =>
                            router.push({
                                pathname: "/shows/watch",
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
