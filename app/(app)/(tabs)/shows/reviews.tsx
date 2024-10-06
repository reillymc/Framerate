import { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import {
    AbsoluteRatingScale,
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSortButton,
    useInfiniteReviews,
} from "@/modules/review";
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
    } = useInfiniteReviews({
        mediaType: MediaType.Show,
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
                    headerRight: () => (
                        <ReviewSortButton
                            order={orderBy}
                            sort={sort}
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
                onOpenMedia={({ mediaId, mediaTitle, mediaPosterUri }) =>
                    router.push({
                        pathname: "/shows/show",
                        params: { mediaId, mediaTitle, mediaPosterUri },
                    })
                }
                onOpenReview={({ reviewId }) =>
                    router.push({
                        pathname: "/shows/review",
                        params: { reviewId },
                    })
                }
            />
        </>
    );
};

export default Reviews;
