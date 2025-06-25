import { type FC, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
    Action,
    type ThemedStyles,
    ToggleInput,
    Undefined,
    useThemedStyles,
} from "@reillymc/react-native-components";

import { useCompany } from "@/modules/company";
import { useMovie } from "@/modules/movie";
import { useMovieReview, useSaveMovieReview } from "@/modules/movieReview";
import {
    useDeleteMovieWatchlistEntry,
    useMovieWatchlistEntry,
} from "@/modules/movieWatchlist";
import { ReviewForm } from "@/modules/review";
import { useCurrentUserConfig } from "@/modules/user";

import { HeaderCloseAction } from "@/components";
import { formatForSave } from "@/helpers/dateHelper";

import { useSelectionModal } from "../../selectionModal";

const EditReview: FC = () => {
    const { reviewId, movieId: movieIdParam } = useLocalSearchParams<{
        reviewId: string;
        movieId: string;
    }>();

    const movieId = movieIdParam
        ? Number.parseInt(movieIdParam, 10)
        : undefined;

    const router = useRouter();
    const { configuration } = useCurrentUserConfig();

    const { data: review } = useMovieReview(reviewId);
    const { data: movie } = useMovie(movieId ?? review?.movie.id);
    const { data: company = [] } = useCompany();
    const { data: watchlistEntry } = useMovieWatchlistEntry(movieId);
    const { mutate: saveReview } = useSaveMovieReview();
    const { mutate: deleteEntry } = useDeleteMovieWatchlistEntry();

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
            company.map(({ companyId, firstName, lastName }) => ({
                value: companyId,
                label: `${firstName} ${lastName}`,
            })),
        [company],
    );

    const initialCompany = useMemo(
        () =>
            review?.company
                ?.map((user) => ({
                    value: user.companyId,
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
        const movieIdValue = movieId ?? review?.movie.id;

        if (!movieIdValue) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? formatForSave(date) : undefined,
            movieId: movieIdValue,
            venue: venue?.trim() || undefined,
            rating: includeReview ? rating || undefined : undefined,
            description: includeReview
                ? description?.trim() || undefined
                : undefined,
            company: selectedCompany.map(({ value }) => ({ companyId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteEntry({ movieId: movieIdValue });
        }
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
                        helpText={`${movie?.title} is currently in your watchlist. ${
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
