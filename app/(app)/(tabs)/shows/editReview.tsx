import { useSession } from "@/modules/auth";
import { useCompany } from "@/modules/company";
import { ReviewForm } from "@/modules/review";
import { useShow } from "@/modules/show";
import { useDeleteShowEntry, useShowEntry } from "@/modules/showEntry";
import { useSaveShowReview, useShowReview } from "@/modules/showReview";
import { useCurrentUserConfig } from "@/modules/user";
import {
    Action,
    type ThemedStyles,
    ToggleInput,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useSelectionModal } from "../../selectionModal";

const EditReview: FC = () => {
    const { reviewId, showId: showIdParam } = useLocalSearchParams<{
        reviewId: string;
        showId: string;
    }>();

    const showId = showIdParam ? Number.parseInt(showIdParam, 10) : undefined;

    const router = useRouter();
    const { userId } = useSession();
    const { configuration } = useCurrentUserConfig();

    const { data: review } = useShowReview(reviewId);
    const { data: show } = useShow(showId ?? review?.show.id);
    const { data: company = [] } = useCompany();
    const { data: watchlistEntry } = useShowEntry(showId);
    const { mutate: saveReview } = useSaveShowReview();
    const { mutate: deleteEntry } = useDeleteShowEntry();

    const styles = useThemedStyles(createStyles, {});

    const [includeDate, setIncludeDate] = useState(true);
    const [includeReview, setIncludeReview] = useState(true);
    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);

    const [date, setDate] = useState(new Date());
    const [rating, setRating] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [venue, setVenue] = useState<string>();

    const companyItems = useMemo(
        () =>
            company
                .filter((user) => user.userId !== userId)
                .map(({ userId, firstName, lastName }) => ({
                    value: userId,
                    label: `${firstName} ${lastName}`,
                })),
        [company, userId],
    );

    const initialCompany = useMemo(
        () =>
            review?.company
                ?.map((user) => ({
                    value: user.userId,
                    label: `${user.firstName} ${user.lastName}`,
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
        const showIdValue = showId ?? review?.show.id;

        if (!showIdValue) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            showId: showIdValue,
            venue: venue?.trim() || undefined,
            rating: includeReview ? rating || undefined : undefined,
            description: includeReview
                ? description?.trim() || undefined
                : undefined,
            company: selectedCompany.map(({ value }) => ({ userId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteEntry({ showId: showIdValue });
        }
        router.back();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: review ? "Edit Watch" : "Add Watch",
                    headerLeft: () => (
                        <Action
                            label="Close"
                            style={styles.headerAction}
                            onPress={router.back}
                        />
                    ),
                    headerRight: () => (
                        <Action
                            label={reviewId ? "Save" : "Create"}
                            style={styles.headerAction}
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
                {!!watchlistEntry && !reviewId && (
                    <ToggleInput
                        label="Mark as watched"
                        iconVariant="check"
                        value={clearWatchlistEntry}
                        onChange={setClearWatchlistEntry}
                        helpText={`${show?.name} is currently in your watchlist. ${
                            clearWatchlistEntry
                                ? "It will be removed when this review is created."
                                : "It will remain there after this review is created."
                        }`}
                    />
                )}
            </ScrollView>
        </>
    );
};

export default EditReview;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.pageBottom * 2,
        },
    });
