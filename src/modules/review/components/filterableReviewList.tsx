import { type ListRenderItem, StyleSheet, View } from "react-native";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { EmptyState, ResponsiveFlatList } from "@/components";
import type { MediaType } from "@/constants/mediaTypes";
import type { Company } from "@/modules/company";

import { getRatingLabel } from "../helpers";
import {
    AbsoluteRatingScale,
    type ReviewOrder,
    type ReviewSort,
} from "../models";
import { FilterableReviewListHeader } from "./filterableReviewListHeader";

const TenStarOptions = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

interface FilterableReviewListProps<T> {
    reviews: T[] | undefined;
    mediaType: MediaType;
    order: ReviewOrder;
    sort: ReviewSort;
    starCount: number;
    filters: {
        rating: number | undefined;
        venue: string | undefined;
        company: Company | undefined;
        onChangeRating: (rating: number | undefined) => void;
        onChangeVenue: (venue: string | undefined) => void;
        onChangeCompany: (userId: string | undefined) => void;
    };
    companyOptions: Company[];
    venueOptions: string[];
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeSort: (sort: ReviewSort) => void;
    onRefresh: () => void;
    onFetchNextPage: () => void;
    renderItem: ListRenderItem<T>;
}

export const FilterableReviewList = <T extends { reviewId: string }>({
    reviews,
    mediaType,
    starCount,
    filters: {
        company,
        venue,
        rating,
        onChangeCompany,
        onChangeRating,
        onChangeVenue,
    },
    order,
    sort,
    companyOptions,
    venueOptions,
    onChangeOrder,
    onChangeSort,
    onRefresh,
    onFetchNextPage,
    renderItem,
}: FilterableReviewListProps<T>) => {
    const styles = useThemedStyles(createStyles, {});

    const starValueList = TenStarOptions.filter(
        (x) => x % (AbsoluteRatingScale / starCount) === 0,
    );

    if (!(reviews?.length || company || venue || rating !== undefined)) {
        return (
            <EmptyState
                heading="No reviews here yet"
                action={
                    <Text variant="caption">
                        Get started by searching for something you have watched
                    </Text>
                }
            />
        );
    }

    return (
        <ResponsiveFlatList
            data={reviews}
            contentInsetAdjustmentBehavior="automatic"
            minColumnWidth={380}
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
                <FilterableReviewListHeader
                    mediaType={mediaType}
                    starValueList={starValueList}
                    rating={rating}
                    venue={venue}
                    company={company}
                    companyOptions={companyOptions}
                    venueOptions={venueOptions}
                    onChangeRating={onChangeRating}
                    onChangeVenue={onChangeVenue}
                    onChangeCompany={onChangeCompany}
                    order={order}
                    sort={sort}
                    onChangeOrder={onChangeOrder}
                    onChangeSort={onChangeSort}
                    starCount={starCount}
                />
            }
            ListFooterComponent={
                reviews?.length ? (
                    <Text style={styles.pageElement}>
                        {reviews?.length} watch
                        {reviews?.length === 1 ? "" : "es"}
                        {rating !== undefined &&
                            ` of ${getRatingLabel(rating, starCount)}`}
                        {venue && ` at ${venue}`}
                        {company &&
                            ` with ${company.firstName} ${company.lastName}`}
                    </Text>
                ) : null
            }
            ListEmptyComponent={
                <EmptyState
                    heading={`No watches${
                        rating === undefined
                            ? ""
                            : ` of ${getRatingLabel(rating, starCount)}`
                    }${venue ? ` at ${venue}` : ""}${
                        company
                            ? ` with ${company.firstName} ${company.lastName}`
                            : ""
                    }`}
                />
            }
            keyExtractor={({ reviewId }) => reviewId}
            renderItem={renderItem}
        />
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        list: {
            paddingTop: spacing.medium,
        },
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        filterList: {
            paddingBottom: spacing.medium,
            gap: spacing.small,
        },
        webListHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        webFilterButtons: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
    });
