import type { UserSummary } from "@/modules/user/services";
import {
    SelectionPanel,
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { type FC, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { getRatingLabel } from "../helpers";
import type { ReviewSummary } from "../services";
import { ReviewSummaryCard } from "./reviewSummaryCard";

interface FilterableReviewListProps {
    reviews: ReviewSummary[] | undefined;
    filters: {
        rating: number | undefined;
        venue: string | undefined;
        company: UserSummary | undefined;
        onChangeRating: (rating: number | undefined) => void;
        onChangeVenue: (venue: string | undefined) => void;
        onChangeCompany: (userId: string | undefined) => void;
    };
    companyOptions: UserSummary[];
    venueOptions: string[];
    onRefresh: () => void;
    onFetchNextPage: () => void;
    onOpenReview: (review: ReviewSummary) => void;
    onOpenMedia: (review: ReviewSummary) => void;
}

export const FilterableReviewList: FC<FilterableReviewListProps> = ({
    reviews,
    filters,
    companyOptions,
    venueOptions,
    onRefresh,
    onFetchNextPage,
    onOpenMedia,
    onOpenReview,
}) => {
    const styles = useThemedStyles(createStyles, {});

    const [panel, setPanel] = useState<"venue" | "rating" | "company">();

    return (
        <>
            <FlatList
                data={reviews}
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
                onRefresh={onRefresh}
                onEndReached={onFetchNextPage}
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
                                filters.rating !== undefined
                                    ? getRatingLabel(filters.rating)
                                    : "All Ratings"
                            }
                            onPress={() => setPanel("rating")}
                            variant="light"
                        />
                        <Tag
                            label={filters.venue ?? "All Venues"}
                            onPress={() => setPanel("venue")}
                            variant="light"
                        />
                        <Tag
                            label={
                                filters.company
                                    ? `${filters.company.firstName} ${filters.company.lastName}`
                                    : "All Company"
                            }
                            onPress={() => setPanel("company")}
                            variant="light"
                        />
                    </ScrollView>
                }
                ListFooterComponent={
                    reviews?.length ? (
                        <Text style={styles.pageElement}>
                            {reviews?.length} reviews
                            {filters.rating &&
                                ` of ${getRatingLabel(filters.rating)}`}
                            {filters.venue && ` at ${filters.venue}`}
                            {filters.company &&
                                ` with ${filters.company.firstName} ${filters.company.lastName}`}
                        </Text>
                    ) : null
                }
                keyExtractor={({ reviewId }) => reviewId}
                renderItem={({ item }) => (
                    <ReviewSummaryCard
                        key={item.reviewId}
                        review={item}
                        onPress={() => onOpenMedia(item)}
                        onOpenReview={() => onOpenReview(item)}
                    />
                )}
            />
            <SelectionPanel
                selectionMode="single"
                show={panel === "venue"}
                label="Venue"
                items={venueOptions.map((name) => ({
                    label: name,
                    value: name,
                }))}
                selection={
                    filters.venue
                        ? {
                              value: filters.venue,
                              label: filters.venue,
                          }
                        : undefined
                }
                onChange={(value) => {
                    filters.onChangeVenue(value?.value);
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
                    filters.rating
                        ? {
                              value: filters.rating,
                              label: getRatingLabel(filters.rating),
                          }
                        : undefined
                }
                onChange={(value) => {
                    filters.onChangeRating(value?.value);
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
                items={companyOptions.map(
                    ({ userId, firstName, lastName }) => ({
                        label: `${firstName} ${lastName}`,
                        value: userId,
                    }),
                )}
                selection={
                    filters.company
                        ? {
                              value: filters.company.userId,
                              label: `${filters.company.firstName} ${filters.company.lastName}`,
                          }
                        : undefined
                }
                onChange={(value) => {
                    filters.onChangeCompany(value?.value);
                }}
                onClose={() => {
                    if (panel !== "company") return;
                    return setPanel(undefined);
                }}
            />
        </>
    );
};

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
