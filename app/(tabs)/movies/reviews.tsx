import { MenuIconButton } from "@/components";
import { placeholderUserId } from "@/constants/placeholderUser";
import {
    ReviewSummaryCard,
    ratingToStars,
    useInfiniteReviews,
} from "@/modules/review";
import { useUser, useUsers } from "@/modules/user";
import {
    SelectionPanel,
    Tag,
    type ThemedStyles,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, router } from "expo-router";
import { type FC, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

const Reviews: FC = () => {
    const [panel, setPanel] = useState<"venue" | "rating" | "company">();
    const [atVenue, setAtVenue] = useState<string | undefined>(undefined);
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [withCompany, setWithCompany] = useState<string | undefined>(
        undefined,
    );
    const {
        data: reviews,
        refetch,
        fetchNextPage,
    } = useInfiniteReviews({
        atVenue,
        withCompany,
        ratingMax: rating,
        ratingMin: rating,
    });
    const { data: user } = useUser(placeholderUserId);
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
                            style={styles.sortIcon}
                        />
                    ),
                }}
            />
            <FlatList
                data={reviewList}
                contentInsetAdjustmentBehavior="automatic"
                CellRendererComponent={({ children }) => (
                    <View style={styles.pageElement}>{children}</View>
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
                        onPressMore={() =>
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
                    setWithCompany(value?.value);
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
                items={users.map(({ userId, firstName, lastName }) => ({
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
