import { ScrollView, StyleSheet } from "react-native";
import { Button, ContextMenu, Host } from "@expo/ui/swift-ui";
import {
    Tag,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import type { MediaType } from "@/constants/mediaTypes";
import type { Company } from "@/modules/company";

import { getRatingLabel } from "../helpers";
import type { ReviewOrder, ReviewSort } from "../models";

interface FilterableReviewListHeaderProps {
    mediaType: MediaType;
    starValueList: number[];
    rating: number | undefined;
    venue: string | undefined;
    company: Company | undefined;
    companyOptions: Company[];
    venueOptions: string[];
    onChangeRating: (rating: number | undefined) => void;
    onChangeVenue: (venue: string | undefined) => void;
    onChangeCompany: (companyId: string | undefined) => void;
    order: ReviewOrder;
    sort: ReviewSort;
    onChangeOrder: (order: ReviewOrder) => void;
    onChangeSort: (sort: ReviewSort) => void;
    starCount: number;
}

export const FilterableReviewListHeader = ({
    starValueList,
    rating,
    venue,
    company,
    companyOptions,
    venueOptions,
    onChangeRating,
    onChangeVenue,
    onChangeCompany,
    starCount,
}: FilterableReviewListHeaderProps) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.pageElement, styles.filterList]}
        >
            <Host matchContents>
                <ContextMenu>
                    <ContextMenu.Items>
                        {starValueList.map((value) => (
                            <Button
                                key={`rating-${value}`}
                                label={getRatingLabel(value, starCount)}
                                onPress={() =>
                                    onChangeRating(
                                        rating === value ? undefined : value,
                                    )
                                }
                                systemImage={
                                    rating === value ? "checkmark" : undefined
                                }
                            />
                        ))}
                        <Button
                            key="rating-no"
                            label="No Rating"
                            onPress={() =>
                                onChangeRating(rating === -1 ? undefined : -1)
                            }
                            systemImage={
                                rating === -1 ? "checkmark" : undefined
                            }
                        />
                    </ContextMenu.Items>
                    <ContextMenu.Trigger>
                        <Tag
                            label={
                                rating === undefined
                                    ? "All Ratings"
                                    : getRatingLabel(rating, starCount)
                            }
                            variant="light"
                        />
                    </ContextMenu.Trigger>
                </ContextMenu>
            </Host>

            {!!venueOptions.length && (
                <Host matchContents>
                    <ContextMenu>
                        <ContextMenu.Items>
                            {venueOptions
                                .sort((a, b) => a.localeCompare(b))
                                .map((name) => (
                                    <Button
                                        key={`venue-${name}`}
                                        label={name}
                                        onPress={() =>
                                            onChangeVenue(
                                                venue === name
                                                    ? undefined
                                                    : name,
                                            )
                                        }
                                        systemImage={
                                            venue === name
                                                ? "checkmark"
                                                : undefined
                                        }
                                    />
                                ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <Tag
                                label={venue ?? "All Venues"}
                                variant="light"
                            />
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </Host>
            )}

            {!!companyOptions.length && (
                <Host matchContents>
                    <ContextMenu>
                        <ContextMenu.Items>
                            {companyOptions
                                .sort((a, b) =>
                                    a.firstName.localeCompare(b.firstName),
                                )
                                .map(({ companyId, firstName, lastName }) => (
                                    <Button
                                        key={`company-${companyId}`}
                                        label={`${firstName} ${lastName}`}
                                        onPress={() =>
                                            onChangeCompany(
                                                company?.companyId === companyId
                                                    ? undefined
                                                    : companyId,
                                            )
                                        }
                                        systemImage={
                                            company?.companyId === companyId
                                                ? "checkmark"
                                                : undefined
                                        }
                                    />
                                ))}
                        </ContextMenu.Items>
                        <ContextMenu.Trigger>
                            <Tag
                                label={
                                    company
                                        ? `${company.firstName} ${company.lastName}`
                                        : "All Company"
                                }
                                variant="light"
                            />
                        </ContextMenu.Trigger>
                    </ContextMenu>
                </Host>
            )}
        </ScrollView>
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        pageElement: {
            paddingHorizontal: spacing.pageHorizontal,
        },
        filterList: {
            paddingBottom: spacing.medium,
            gap: spacing.small,
        },
    });
