import { ContextMenu, EmptyState } from "@/components";
import type { UserSummary } from "@/modules/user/services";
import {
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useMemo } from "react";
import {
    FlatList,
    type ListRenderItem,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { getRatingLabel } from "../helpers";
import { AbsoluteRatingScale, type Review } from "../models";

const TenStarOptions = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

interface FilterableReviewListProps<T extends Review> {
    reviews: T[] | undefined;
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
    starCount: number;
    onRefresh: () => void;
    onFetchNextPage: () => void;
    renderItem: ListRenderItem<T>;
}

// TODO: Generic? T extends Review?
export const FilterableReviewList = <T extends Review>({
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
    starCount,
    onRefresh,
    onFetchNextPage,
    renderItem,
}: FilterableReviewListProps<T>) => {
    const styles = useThemedStyles(createStyles, {});

    const starValueList = useMemo(
        () =>
            TenStarOptions.filter(
                (x) => x % (AbsoluteRatingScale / starCount) === 0,
            ),
        [starCount],
    );

    if (!(reviews?.length || company || venue || rating)) {
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
                                menuItems: starValueList.map((value) => ({
                                    actionKey: value.toString(),
                                    actionTitle: getRatingLabel(
                                        value,
                                        starCount,
                                    ),
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
                                        ? getRatingLabel(rating, starCount)
                                        : "All Ratings"
                                }
                                variant="light"
                            />
                        </ContextMenu>
                        {!!venueOptions.length && (
                            <ContextMenu
                                menuConfig={{
                                    menuTitle: "Venue",
                                    menuItems: venueOptions.map((name) => ({
                                        actionKey: name,
                                        actionTitle: name,
                                        menuState:
                                            venue === name ? "on" : "off",
                                    })),
                                }}
                                onPressMenuAction={({ actionKey }) => {
                                    onChangeVenue(
                                        venue !== actionKey
                                            ? actionKey
                                            : undefined,
                                    );
                                }}
                            >
                                <Tag
                                    label={venue ?? "All Venues"}
                                    variant="light"
                                />
                            </ContextMenu>
                        )}
                        {!!companyOptions.length && (
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
                        )}
                    </ScrollView>
                }
                ListFooterComponent={
                    reviews?.length ? (
                        <Text style={styles.pageElement}>
                            {reviews?.length} review
                            {reviews?.length === 1 ? "" : "s"}
                            {rating &&
                                ` of ${getRatingLabel(rating, starCount)}`}
                            {venue && ` at ${venue}`}
                            {company &&
                                ` with ${company.firstName} ${company.lastName}`}
                        </Text>
                    ) : null
                }
                ListEmptyComponent={
                    <EmptyState
                        heading={`No reviews${
                            rating
                                ? ` of ${getRatingLabel(rating, starCount)}`
                                : ""
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
