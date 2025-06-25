import { useMemo } from "react";
import {
    type ListRenderItem,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import {
    Tag,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import type { Company } from "@/modules/company";

import {
    BlurIconAction,
    ContextMenu,
    EmptyState,
    ResponsiveFlatList,
} from "@/components";
import {
    DropdownButton,
    MenuDecorator,
    MenuOption,
    MenuOptionContentToggle,
    WebDropdownMenu,
} from "@/components/webDropdown";
import { MediaType } from "@/constants/mediaTypes";

import { getRatingLabel } from "../helpers";
import {
    AbsoluteRatingScale,
    type ReviewOrder,
    type ReviewSort,
} from "../models";

const TenStarOptions = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0];

const menuState = (condition: boolean) =>
    condition ? ("on" as const) : ("off" as const);

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

    const starValueList = useMemo(
        () =>
            TenStarOptions.filter(
                (x) => x % (AbsoluteRatingScale / starCount) === 0,
            ),
        [starCount],
    );

    const SortOptions: { value: ReviewSort; label: string }[] = [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" },
    ];

    const OrderOptions: { value: ReviewOrder; label: string }[] = [
        { value: "date", label: "Review Date" },
        { value: "rating", label: "Review Rating" },
        {
            value: "mediaTitle",
            label: mediaType === MediaType.Movie ? "Movie Title" : "Show Title",
        },
        {
            value: "mediaReleaseDate",
            label:
                mediaType === MediaType.Movie
                    ? "Movie Release Date"
                    : "Show Air Date",
        },
    ];

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
                    Platform.OS !== "web" ? (
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
                                            menuState: menuState(
                                                rating === value,
                                            ),
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
                    ) : (
                        <View
                            style={[
                                styles.pageElement,
                                styles.filterList,
                                styles.webListHeader,
                            ]}
                        >
                            <View style={styles.webFilterButtons}>
                                <WebDropdownMenu
                                    trigger={
                                        <DropdownButton
                                            label={
                                                rating !== undefined
                                                    ? getRatingLabel(
                                                          rating,
                                                          starCount,
                                                      )
                                                    : "All Ratings"
                                            }
                                        />
                                    }
                                >
                                    {[
                                        ...starValueList.map((value) => (
                                            <MenuOption
                                                key={value}
                                                onSelect={() =>
                                                    onChangeRating(
                                                        rating !== value
                                                            ? value
                                                            : undefined,
                                                    )
                                                }
                                            >
                                                <MenuOptionContentToggle
                                                    title={getRatingLabel(
                                                        value,
                                                        starCount,
                                                    )}
                                                    selected={rating === value}
                                                />
                                            </MenuOption>
                                        )),
                                        <MenuOption
                                            key="-1"
                                            onSelect={() =>
                                                onChangeRating(
                                                    rating !== -1
                                                        ? -1
                                                        : undefined,
                                                )
                                            }
                                        >
                                            <MenuOptionContentToggle
                                                title="No Rating"
                                                selected={rating === -1}
                                            />
                                        </MenuOption>,
                                    ]}
                                </WebDropdownMenu>
                                <WebDropdownMenu
                                    trigger={
                                        <DropdownButton
                                            label={venue ?? "All Venues"}
                                        />
                                    }
                                >
                                    {venueOptions
                                        .sort((a, b) => a.localeCompare(b))
                                        .map((value) => (
                                            <MenuOption
                                                key={value}
                                                onSelect={() =>
                                                    onChangeVenue(
                                                        venue !== value
                                                            ? value
                                                            : undefined,
                                                    )
                                                }
                                            >
                                                <MenuOptionContentToggle
                                                    title={value}
                                                    selected={venue === value}
                                                />
                                            </MenuOption>
                                        ))}
                                </WebDropdownMenu>
                                <WebDropdownMenu
                                    trigger={
                                        <DropdownButton
                                            label={
                                                company
                                                    ? `${company.firstName} ${company.lastName}`
                                                    : "All Company"
                                            }
                                        />
                                    }
                                >
                                    {companyOptions
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
                                            }) => (
                                                <MenuOption
                                                    key={companyId}
                                                    onSelect={() =>
                                                        onChangeCompany(
                                                            company?.companyId !==
                                                                companyId
                                                                ? companyId
                                                                : undefined,
                                                        )
                                                    }
                                                >
                                                    <MenuOptionContentToggle
                                                        title={`${firstName} ${lastName}`}
                                                        selected={
                                                            company?.companyId ===
                                                            companyId
                                                        }
                                                    />
                                                </MenuOption>
                                            ),
                                        )}
                                </WebDropdownMenu>
                            </View>
                            <WebDropdownMenu
                                trigger={
                                    <BlurIconAction
                                        iconName="arrow-switch"
                                        variant="flat"
                                        style={[
                                            styles.sortIcon,
                                            {
                                                borderRadius: 8,
                                                padding: 20,
                                            },
                                        ]}
                                    />
                                }
                            >
                                {[
                                    ...OrderOptions.map(({ value, label }) => (
                                        <MenuOption
                                            key={value}
                                            onSelect={() =>
                                                onChangeOrder(value)
                                            }
                                        >
                                            <MenuOptionContentToggle
                                                title={label}
                                                selected={order === value}
                                            />
                                        </MenuOption>
                                    )),
                                    <MenuDecorator key="separator">
                                        <View
                                            style={{
                                                height: 4,
                                                width: "100%",
                                                borderRadius: 4,
                                                backgroundColor: "#ddd",
                                            }}
                                        />
                                    </MenuDecorator>,
                                    ...SortOptions.map(({ value, label }) => (
                                        <MenuOption
                                            key={value}
                                            onSelect={() => onChangeSort(value)}
                                        >
                                            <MenuOptionContentToggle
                                                title={label}
                                                selected={sort === value}
                                            />
                                        </MenuOption>
                                    )),
                                ]}
                            </WebDropdownMenu>
                        </View>
                    )
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
