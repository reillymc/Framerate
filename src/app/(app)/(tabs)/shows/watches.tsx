import { type FC, useMemo, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { Undefined } from "@reillymc/es-utils";

import { ScreenLayout } from "@/components";
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
        <ScreenLayout
            meta={
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
            }
        >
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
                    <Link
                        key={item.reviewId}
                        href={{
                            pathname: "/shows/show",
                            params: {
                                id: item.show.id,
                                name: item.show.name,
                                posterPath: item.show.posterPath,
                            },
                        }}
                        asChild
                    >
                        <Link.Menu title={item.show.name}>
                            <Link.MenuAction
                                title="Open Watch"
                                onPress={() =>
                                    router.push({
                                        pathname: "/shows/watch",
                                        params: { reviewId: item.reviewId },
                                    })
                                }
                                icon="book"
                            />
                        </Link.Menu>
                        <Link.Trigger>
                            <ReviewSummaryCard
                                review={item}
                                mediaTitle={item.show.name}
                                mediaPosterPath={item.show.posterPath}
                                mediaDate={item.show.firstAirDate}
                                starCount={configuration.ratings.starCount}
                            />
                        </Link.Trigger>
                        <Link.Preview />
                    </Link>
                )}
            />
        </ScreenLayout>
    );
};

export default Reviews;
