import { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import {
    AbsoluteRatingScale,
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSortButton,
    ReviewSummaryCard,
} from "@/modules/review";
import { useShowReviews } from "@/modules/showReview";
import { useCurrentUserConfig, useUsers } from "@/modules/user";
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

    const { userId } = useSession();
    const { configuration } = useCurrentUserConfig();

    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useShowReviews({
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

    // TODO: update with user configuration knownUsers when implemented
    const { data: users = [] } = useUsers();

    const reviewList = useMemo(
        () => reviews?.pages?.flat().filter(Undefined),
        [reviews],
    );

    const selectedUser = useMemo(
        () => users.find(({ userId }) => userId === withCompany),
        [users, withCompany],
    );

    const filteredUsers = useMemo(
        () => users.filter((user) => user.userId !== userId),
        [users, userId],
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
                                mediaType={MediaType.Show}
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
                companyOptions={filteredUsers}
                filters={{
                    company: selectedUser,
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
                                pathname: "/shows/review",
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
