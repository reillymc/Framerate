import { type FC, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Undefined } from "@reillymc/es-utils";
import {
    Action,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useCompany } from "@/modules/company";
import { ReviewForm } from "@/modules/review";
import { useSaveSeasonReview, useSeasonReview } from "@/modules/seasonReview";
import { useCurrentUserConfig } from "@/modules/user";

import { HeaderCloseAction } from "@/components";
import { formatForSave } from "@/helpers/dateHelper";

import { useSelectionModal } from "../../../selectionModal";

const EditReview: FC = () => {
    const {
        reviewId,
        showId: showIdParam,
        seasonNumber: seasonNumberParam,
    } = useLocalSearchParams<{
        reviewId: string;
        showId: string;
        seasonNumber?: string;
    }>();

    const showId = showIdParam ? Number.parseInt(showIdParam, 10) : undefined;

    const seasonNumber = seasonNumberParam
        ? Number.parseInt(seasonNumberParam, 10)
        : undefined;

    const router = useRouter();
    const { configuration } = useCurrentUserConfig();

    const { data: review } = useSeasonReview(reviewId);
    const { data: company = [] } = useCompany();
    const { mutate: saveReview } = useSaveSeasonReview();

    const styles = useThemedStyles(createStyles, {});

    const [includeDate, setIncludeDate] = useState(true);
    const [includeReview, setIncludeReview] = useState(true);

    const [date, setDate] = useState(new Date());
    const [rating, setRating] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [venue, setVenue] = useState<string>();

    const companyItems = useMemo(
        () =>
            company.map(({ companyId, firstName, lastName }) => ({
                value: companyId,
                label: `${firstName} ${lastName}`,
            })),
        [company],
    );

    const initialCompany = useMemo(
        () =>
            review?.company
                ?.map(({ companyId, firstName, lastName }) => ({
                    value: companyId,
                    label: `${firstName} ${lastName}`,
                }))
                .filter(Undefined),
        [review?.company],
    );

    const { selectedItems: selectedCompany, openSelectionModal } =
        useSelectionModal({
            key: "company",
            selectionMode: "multi",
            label: "Company",
            items: companyItems,
            initialSelection: initialCompany,
        });

    useEffect(() => {
        if (!review) return;
        setDate(review.date ? new Date(review.date) : new Date());
        setRating(review.rating);
        setDescription(review.description);
        setIncludeDate(!!review.date);
        setIncludeReview(!!review.rating || !!review.description);
        setVenue(review.venue);
    }, [review]);

    const handleSave = () => {
        const showIdValue = showId ?? review?.season.showId;
        const seasonNumberValue = seasonNumber ?? review?.season.seasonNumber;

        if (!(showIdValue && seasonNumberValue)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? formatForSave(date) : undefined,
            showId: showIdValue,
            seasonNumber: seasonNumberValue,
            venue: venue?.trim() || undefined,
            rating: includeReview ? rating || undefined : undefined,
            description: includeReview
                ? description?.trim() || undefined
                : undefined,
            company: selectedCompany.map(({ value }) => ({ companyId: value })),
        });

        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: review ? "Edit Watch" : "Add Watch",
                    headerLeft: () => (
                        <HeaderCloseAction onClose={router.back} />
                    ),
                    headerRight: () => (
                        <Action
                            label={reviewId ? "Save" : "Create"}
                            containerStyle={styles.headerAction}
                            onPress={handleSave}
                        />
                    ),
                }}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <ReviewForm
                    companyOptions={companyItems}
                    rating={rating}
                    includeReview={includeReview}
                    includeDate={includeDate}
                    date={date}
                    company={selectedCompany}
                    description={description}
                    venue={venue}
                    starCount={configuration.ratings.starCount}
                    venueOptions={configuration.venues.knownVenueNames}
                    onRatingChange={setRating}
                    onIncludeDateChange={setIncludeDate}
                    onIncludeReviewChange={setIncludeReview}
                    onDateChange={setDate}
                    onDescriptionChange={setDescription}
                    onCompanyPress={openSelectionModal}
                    onVenueChange={setVenue}
                />
            </ScrollView>
        </>
    );
};

export default EditReview;

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: spacing.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
            paddingBottom: spacing.pageBottom * 2,
        },
    });
