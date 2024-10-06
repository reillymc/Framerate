import { ContextMenu } from "@/components";
import type { UserSummary } from "@/modules/user/services";
import {
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
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
    filters: {
        company,
        venue,
        rating,
        onChangeCompany,
        onChangeRating,
        onChangeVenue,
    },
    companyOptions,
    venueOptions,
    onRefresh,
    onFetchNextPage,
    onOpenMedia,
    onOpenReview,
}) => {
    const styles = useThemedStyles(createStyles, {});

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
                        <ContextMenu
                            menuConfig={{
                                menuTitle: "Rating",
                                menuItems: [
                                    100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0,
                                ].map((value) => ({
                                    actionKey: value.toString(),
                                    actionTitle: getRatingLabel(value),
                                    menuState: rating === value ? "on" : "off",
                                })),
                            }}
                            onPressMenuAction={({ actionKey }) => {
                                const value = Number.parseInt(actionKey);
                                onChangeRating(
                                    rating !== value ? value : undefined,
                                );
                            }}
                        >
                            <Tag
                                label={
                                    rating !== undefined
                                        ? getRatingLabel(rating)
                                        : "All Ratings"
                                }
                                variant="light"
                            />
                        </ContextMenu>
                        <ContextMenu
                            menuConfig={{
                                menuTitle: "Venue",
                                menuItems: venueOptions.map((name) => ({
                                    actionKey: name,
                                    actionTitle: name,
                                    menuState: venue === name ? "on" : "off",
                                })),
                            }}
                            onPressMenuAction={({ actionKey }) => {
                                onChangeVenue(
                                    venue !== actionKey ? actionKey : undefined,
                                );
                            }}
                        >
                            <Tag
                                label={venue ?? "All Venues"}
                                variant="light"
                            />
                        </ContextMenu>
                        <ContextMenu
                            menuConfig={{
                                menuTitle: "Company",
                                menuItems: companyOptions.map(
                                    ({ userId, firstName, lastName }) => ({
                                        actionKey: userId,
                                        actionTitle: `${firstName} ${lastName}`,
                                        menuState:
                                            company?.userId === userId
                                                ? "on"
                                                : "off",
                                    }),
                                ),
                            }}
                            onPressMenuAction={({ actionKey }) => {
                                onChangeCompany(
                                    company?.userId !== actionKey
                                        ? actionKey
                                        : undefined,
                                );
                            }}
                        >
                            <Tag
                                label={
                                    company
                                        ? `${company.firstName} ${company.lastName}`
                                        : "All Company"
                                }
                                variant="light"
                            />
                        </ContextMenu>
                    </ScrollView>
                }
                ListFooterComponent={
                    reviews?.length ? (
                        <Text style={styles.pageElement}>
                            {reviews?.length} review
                            {reviews?.length === 1 ? "" : "s"}
                            {rating && ` of ${getRatingLabel(rating)}`}
                            {venue && ` at ${venue}`}
                            {company &&
                                ` with ${company.firstName} ${company.lastName}`}
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
