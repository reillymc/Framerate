import { useSession } from "@/modules/auth";
import { useCompany } from "@/modules/company";
import { useMovie } from "@/modules/movie";
import { useDeleteMovieEntry, useMovieEntry } from "@/modules/movieEntry";
import { useMovieReview, useSaveMovieReview } from "@/modules/movieReview";
import { ReviewForm, getRatingLabel } from "@/modules/review";
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
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import { useSelectionModal } from "../../selectionModal";

const EditReview: FC = () => {
    const { reviewId, movieId: movieIdParam } = useLocalSearchParams<{
        reviewId: string;
        movieId: string;
    }>();

    const movieId = movieIdParam
        ? Number.parseInt(movieIdParam, 10)
        : undefined;

    const { userId } = useSession();

    const { data: review } = useMovieReview(reviewId);
    const { data: movie } = useMovie(movieId ?? review?.movie.id);
    const router = useRouter();
    const { mutate: saveReview } = useSaveMovieReview();
    const { data: company = [] } = useCompany();
    const { configuration } = useCurrentUserConfig();
    const { mutate: deleteEntry } = useDeleteMovieEntry();

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );
    const [rating, setRating] = useState(review?.rating ?? 0);
    const [description, setDescription] = useState(review?.description ?? "");

    const [includeDate, setIncludeDate] = useState(
        review ? !!review.date : true,
    );
    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);
    const [venue, setVenue] = useState(review?.venue);

    const companyItems = useMemo(() => {
        const filteredUsers = company.filter((user) => user.userId !== userId);

        return filteredUsers.map((user) => ({
            value: user.userId,
            label: `${user.firstName} ${user.lastName}`,
        }));
    }, [company, userId]);

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

    const { data: watchlistEntry } = useMovieEntry(movieId);

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
        setRating(review?.rating ?? 0);
        setDescription(review?.description ?? "");
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const movieIdValue = movieId ?? review?.movie.id;

        if (!(rating && movieIdValue)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            movieId: movieIdValue,
            venue,
            rating,
            description,
            company: selectedCompany.map(({ value }) => ({ userId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteEntry({ movieId: movieIdValue });
        }
        handleClose();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: getRatingLabel(
                        rating,
                        configuration.ratings.starCount,
                    ),
                    headerLeft: () => (
                        <Action
                            label="Close"
                            style={styles.headerAction}
                            onPress={handleClose}
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
            <StatusBar barStyle="light-content" animated={true} />
            <ScrollView
                scrollEnabled={false}
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
            >
                <ReviewForm
                    companyOptions={companyItems}
                    rating={rating}
                    includeDate={includeDate}
                    date={date}
                    company={selectedCompany}
                    description={description}
                    venue={venue}
                    starCount={configuration.ratings.starCount}
                    venueOptions={configuration.venues.knownVenueNames}
                    onRatingChange={setRating}
                    onIncludeDateChange={setIncludeDate}
                    onDateChange={setDate}
                    onDescriptionChange={setDescription}
                    onCompanyPress={openSelectionModal}
                    onVenueChange={setVenue}
                />
                {!!watchlistEntry && !reviewId && (
                    <ToggleInput
                        label="Mark as watched"
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

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: padding.pageBottom,
        },
    });
