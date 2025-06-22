import { ContextMenu, EmptyState, ResponsiveFlatList } from "@/components";
import type { Company } from "@/modules/company";
import {
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { useMemo } from "react";
import {
    type ListRenderItem,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { getRatingLabel } from "../helpers";
import { AbsoluteRatingScale } from "../models";

const TenStarOptions = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

const menuState = (condition: boolean) =>
    condition ? ("on" as const) : ("off" as const);

interface FilterableReviewListProps<T> {
    reviews: T[] | undefined;
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
    starCount: number;
    onRefresh: () => void;
    onFetchNextPage: () => void;
    renderItem: ListRenderItem<T>;
}

export const FilterableReviewList = <T extends { reviewId: string }>({
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
        <>
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
                                    ...starValueList.map((value) => ({
                                        actionKey: value.toString(),
                                        actionTitle: getRatingLabel(
                                            value,
                                            starCount,
                                        ),
                                        menuState: menuState(rating === value),
                                    })),
                                    {
                                        actionKey: "-1",
                                        actionTitle: "No Rating",
                                        menuState: menuState(rating === -1),
                                    },
                                ],
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
                                    menuItems: venueOptions
                                        .sort((a, b) => a.localeCompare(b))
                                        .map((name) => ({
                                            actionKey: name,
                                            actionTitle: name,
                                            menuState: menuState(
                                                venue === name,
                                            ),
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
                                    menuItems: companyOptions
                                        .sort((a, b) =>
                                            a.firstName.localeCompare(
                                                b.firstName,
                                            ),
                                        )
                                        .map(
                                            ({
                                                companyId,
                                                firstName,
                                                lastName,
                                            }) => ({
                                                actionKey: companyId,
                                                actionTitle: `${firstName} ${lastName}`,
                                                menuState:
                                                    company?.companyId ===
                                                    companyId
                                                        ? "on"
                                                        : "off",
                                            }),
                                        ),
                                }}
                                onPressMenuAction={({ actionKey }) => {
                                    onChangeCompany(
                                        company?.companyId !== actionKey
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
                        heading={`No reviews${
                            rating !== undefined
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
        },
        sortIcon: {
            transform: [{ rotateZ: "90deg" }],
        },
    });
