import { MenuIconButton } from "@/components";
import { useSession } from "@/modules/auth";
import {
    ReviewSummaryCard,
    ratingToStars,
    useInfiniteReviews,
} from "@/modules/review";
import { useUser, useUsers } from "@/modules/user";
import {
    SelectionPanel,
    Tag,
    Text,
    type ThemedStyles,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { type FC, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

type Order = "rating" | "date" | "mediaTitle" | "mediaReleaseDate";
type Sort = "asc" | "desc";

const Reviews: FC = () => {
    const [panel, setPanel] = useState<"venue" | "rating" | "company">();
    const [atVenue, setAtVenue] = useState<string | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [withCompany, setWithCompany] = useState<string | undefined>(
        undefined,
    );
    const [orderBy, setOrderBy] = useState<Order>("date");
    const [sort, setSort] = useState<Sort>("desc");

    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useInfiniteReviews({
        atVenue,
        withCompany,
        ratingMax: rating,
        ratingMin: rating,
        sort,
        orderBy,
    });
    const { userId } = useSession();
    const { data: user } = useUser(userId);
    // TODO: update with user configuration knownUsers when implemented
    const { data: users = [] } = useUsers();

    const styles = useThemedStyles(createStyles, {});

    const reviewList = useMemo(
        () => reviews?.pages?.flat().filter(Undefined),
        [reviews],
    );

    const selectedUser = useMemo(
        () => users.find(({ userId }) => userId === withCompany),
        [users, withCompany],
    );

    return (
        <>
            <Stack.Screen
                options={{
                    title: "My Reviews",
                    headerRight: () => (
                        <MenuIconButton
                            iconName="arrow-switch"
                            variant="secondary"
                            menuConfig={{
                                menuTitle: "Sort reviews by",
                                menuItems: [
                                    {
                                        actionKey: "date",
                                        actionTitle: "Review Date",
                                        menuState:
                                            orderBy === "date" ? "on" : "off",
                                    },
                                    {
                                        actionKey: "rating",
                                        actionTitle: "Review Rating",
                                        menuState:
                                            orderBy === "rating" ? "on" : "off",
                                    },
                                    {
                                        actionKey: "mediaTitle",
                                        actionTitle: "Movie Title",
                                        menuState:
                                            orderBy === "mediaTitle"
                                                ? "on"
                                                : "off",
                                    },
                                    {
                                        actionKey: "mediaReleaseDate",
                                        actionTitle: "Movie Release Date",
                                        menuState:
                                            orderBy === "mediaReleaseDate"
                                                ? "on"
                                                : "off",
                                    },
                                    {
                                        type: "menu",
                                        menuTitle: "",
                                        menuOptions: ["displayInline"],
                                        menuItems: [
                                            {
                                                type: "action",
                                                actionKey: "asc",
                                                actionTitle: "Ascending",
                                                menuState:
                                                    sort === "asc"
                                                        ? "on"
                                                        : "off",
                                            },
                                            {
                                                type: "action",
                                                actionKey: "desc",
                                                actionTitle: "Descending",
                                                menuState:
                                                    sort === "desc"
                                                        ? "on"
                                                        : "off",
                                            },
                                        ],
                                    },
                                ],
                            }}
                            onPressMenuItem={({ nativeEvent }) => {
                                if (
                                    [
                                        "rating",
                                        "mediaTitle",
                                        "date",
                                        "mediaReleaseDate",
                                    ].includes(nativeEvent.actionKey)
                                ) {
                                    setOrderBy(nativeEvent.actionKey as Order);
                                    return;
                                }

                                if (
                                    ["asc", "desc"].includes(
                                        nativeEvent.actionKey,
                                    )
                                ) {
                                    setSort(nativeEvent.actionKey as Sort);
                                    return;
                                }
                            }}
                            style={styles.sortIcon}
                        />
                    ),
                }}
            />
            <FlatList
                data={reviewList}
                contentInsetAdjustmentBehavior="automatic"
                CellRendererComponent={({ children, cellKey, onLayout }) => (
                    <View
                        key={cellKey}
                        onLayout={onLayout}
                        style={styles.pageElement}
                    >
                        {children}
                    </View>
                )}
                onRefresh={refetch}
                onEndReached={() => fetchNextPage()}
                onEndReachedThreshold={0.5}
                refreshing={false}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.pageElement,
                            styles.filterList,
                        ]}
                    >
                        <Tag
                            label={
                                rating !== undefined
                                    ? getRatingLabel(rating)
                                    : "All Ratings"
                            }
                            onPress={() => setPanel("rating")}
                            variant="light"
                        />
                        <Tag
                            label={atVenue ?? "All Venues"}
                            onPress={() => setPanel("venue")}
                            variant="light"
                        />
                        <Tag
                            label={
                                selectedUser
                                    ? `${selectedUser.firstName} ${selectedUser.lastName}`
                                    : "All Company"
                            }
                            onPress={() => setPanel("company")}
                            variant="light"
                        />
                    </ScrollView>
                }
                ListFooterComponent={
                    reviewList?.length ? (
                        <Text style={styles.pageElement}>
                            {reviewList?.length} reviews
                            {rating && ` of ${getRatingLabel(rating)}`}
                            {atVenue && ` at ${atVenue}`}
                            {withCompany &&
                                ` with ${selectedUser?.firstName} ${selectedUser?.lastName}`}
                        </Text>
                    ) : null
                }
                keyExtractor={({ reviewId }) => reviewId}
                renderItem={({ item }) => (
                    <ReviewSummaryCard
                        key={item.reviewId}
                        review={item}
                        onPress={() =>
                            router.push({
                                pathname: "/movies/movie",
                                params: {
                                    mediaId: item.mediaId,
                                    mediaTitle: item.mediaTitle,
                                    mediaPosterUri: item.mediaPosterUri,
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
            <SelectionPanel
                selectionMode="single"
                show={panel === "venue"}
                label="Venue"
                items={user?.configuration.venues.knownVenueNames.map(
                    (name) => ({
                        label: name,
                        value: name,
                    }),
                )}
                selection={
                    atVenue
                        ? {
                              value: atVenue,
                              label: atVenue,
                          }
                        : undefined
                }
                onChange={(value) => {
                    setAtVenue(value?.value);
                }}
                onClose={() => {
                    if (panel !== "venue") return;
                    return setPanel(undefined);
                }}
            />
            <SelectionPanel
                selectionMode="single"
                show={panel === "rating"}
                label="Rating"
                items={[
                    100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30,
                    25, 20, 15, 10, 5,
                ].map((value) => ({
                    label: getRatingLabel(value),
                    value,
                }))}
                selection={
                    rating
                        ? {
                              value: rating,
                              label: getRatingLabel(rating),
                          }
                        : undefined
                }
                onChange={(value) => {
                    setRating(value?.value);
                }}
                onClose={() => {
                    if (panel !== "rating") return;

                    return setPanel(undefined);
                }}
            />
            <SelectionPanel
                selectionMode="single"
                show={panel === "company"}
                label="Company"
                items={users
                    .filter(({ userId }) => userId !== user?.userId)
                    .map(({ userId, firstName, lastName }) => ({
                        label: `${firstName} ${lastName}`,
                        value: userId,
                    }))}
                selection={
                    withCompany
                        ? {
                              value: withCompany,
                              label: `${selectedUser?.firstName} ${selectedUser?.lastName}`,
                          }
                        : undefined
                }
                onChange={(value) => {
                    setWithCompany(value?.value);
                }}
                onClose={() => {
                    if (panel !== "company") return;
                    return setPanel(undefined);
                }}
            />
        </>
    );
};

export default Reviews;

const getRatingLabel = (rating: number) =>
    `${ratingToStars(rating)} Star${rating === 10 ? "" : "s"}`;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: padding.regular,
        },
        pageElement: {
            paddingHorizontal: padding.pageHorizontal,
        },
        filterList: {
            paddingBottom: padding.regular,
        },
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
    });
