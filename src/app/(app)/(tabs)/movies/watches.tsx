import { type FC, useMemo, useState } from "react";
import { Link, Stack, useRouter } from "expo-router";
import { Undefined } from "@reillymc/es-utils";

import { ScreenLayout } from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useCompany } from "@/modules/company";
import { useMovieReviews } from "@/modules/movieReview";
import {
    AbsoluteRatingScale,
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSummaryCard,
} from "@/modules/review";
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
    } = useMovieReviews({
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
                        // biome-ignore lint/style/useNamingConvention: current expo naming convention
                        unstable_headerRightItems: () => [
                            {
                                type: "menu" as const,
                                label: "Sort & Filter",
                                icon: {
                                    type: "sfSymbol",
                                    name: "arrow.up.arrow.down",
                                },
                                menu: {
                                    title: "Sort by",
                                    multiselectable: true,
                                    items: [
                                        {
                                            type: "action" as const,
                                            key: "date",
                                            label: "Review Date",
                                            state:
                                                orderBy === "date"
                                                    ? "on"
                                                    : "off",
                                            onPress: () => setOrderBy("date"),
                                        },
                                        {
                                            type: "action" as const,
                                            key: "rating",
                                            label: "Review Rating",
                                            state:
                                                orderBy === "rating"
                                                    ? "on"
                                                    : "off",
                                            onPress: () => setOrderBy("rating"),
                                        },
                                        {
                                            type: "action" as const,
                                            key: "mediaTitle",
                                            label: "Movie Title",
                                            state:
                                                orderBy === "mediaTitle"
                                                    ? "on"
                                                    : "off",
                                            onPress: () =>
                                                setOrderBy("mediaTitle"),
                                        },
                                        {
                                            type: "action" as const,
                                            key: "mediaReleaseDate",
                                            label: "Movie Release Date",
                                            state:
                                                orderBy === "mediaReleaseDate"
                                                    ? "on"
                                                    : "off",
                                            onPress: () =>
                                                setOrderBy("mediaReleaseDate"),
                                        },
                                        {
                                            type: "submenu" as const,
                                            label: "",
                                            inline: true,
                                            items: [
                                                {
                                                    type: "action" as const,
                                                    key: "asc",
                                                    label: "Ascending",
                                                    state:
                                                        sort === "asc"
                                                            ? "on"
                                                            : "off",
                                                    onPress: () =>
                                                        setSort("asc"),
                                                },
                                                {
                                                    type: "action" as const,
                                                    key: "desc",
                                                    label: "Descending",
                                                    state:
                                                        sort === "desc"
                                                            ? "on"
                                                            : "off",
                                                    onPress: () =>
                                                        setSort("desc"),
                                                },
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
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
                        href={{
                            pathname: "/movies/movie",
                            params: {
                                id: item.movie.id,
                                title: item.movie.title,
                                posterPath: item.movie.posterPath,
                            },
                        }}
                        asChild
                    >
                        <Link.Menu title={item.title}>
                            <Link.MenuAction
                                title="Open Watch"
                                onPress={() =>
                                    router.push({
                                        pathname: "/movies/watch",
                                        params: {
                                            reviewId: item.reviewId,
                                        },
                                    })
                                }
                                icon="book"
                            />
                        </Link.Menu>
                        <Link.Trigger>
                            <ReviewSummaryCard
                                key={item.reviewId}
                                review={item}
                                mediaTitle={item.movie.title}
                                mediaPosterPath={item.movie.posterPath}
                                mediaDate={item.movie.releaseDate}
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
