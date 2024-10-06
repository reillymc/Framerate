import { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import {
    FilterableReviewList,
    type ReviewOrder,
    type ReviewSort,
    ReviewSortButton,
    useInfiniteReviews,
} from "@/modules/review";
import { useUser, useUsers } from "@/modules/user";
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

    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useInfiniteReviews({
        mediaType: MediaType.Movie,
        atVenue,
        withCompany,
        ratingMax: rating !== undefined ? rating + 9 : undefined,
        ratingMin: rating,
        sort,
        orderBy,
    });
    const { userId } = useSession();
    const { data: user } = useUser(userId);
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
                venueOptions={user?.configuration.venues.knownVenueNames ?? []}
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
                        pathname: "/movies/movie",
                        params: { mediaId, mediaTitle, mediaPosterUri },
                    })
                }
                onOpenReview={({ reviewId }) =>
                    router.push({
                        pathname: "/movies/review",
                        params: { reviewId },
                    })
                }
            />
        </>
    );
};

export default Reviews;
