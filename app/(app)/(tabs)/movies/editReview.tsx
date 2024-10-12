import { MediaType } from "@/constants/mediaTypes";
import { useSession } from "@/modules/auth";
import { useMovie } from "@/modules/movie";
import { useMovieReview, useSaveMovieReview } from "@/modules/movieReview";
import { ReviewForm, getRatingLabel } from "@/modules/review";
import { useCurrentUserConfig, useUsers } from "@/modules/user";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import {
    Action,
    type ThemedStyles,
    ToggleInput,
    Undefined,
    type ValueItem,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";

const EditReview: FC = () => {
    const { reviewId, movieId: movieIdParam } = useGlobalSearchParams<{
        reviewId: string;
        movieId: string;
    }>();

    const movieId = movieIdParam
        ? Number.parseInt(movieIdParam ?? "", 10)
        : undefined;

    const { userId } = useSession();

    const { data: review } = useMovieReview(reviewId);
    const { data: movie } = useMovie(movieId ?? review?.movie.id);
    const router = useRouter();
    const { mutate: saveReview } = useSaveMovieReview();
    const { data: users = [] } = useUsers();
    const { configuration } = useCurrentUserConfig();
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();

    const filteredUsers = users.filter((user) => user.userId !== userId);

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
    const [company, setCompany] = useState<ValueItem[]>(
        review?.company
            ?.map((user) => ({
                value: user.userId,
                label: `${user.firstName} ${user.lastName}`,
            }))
            .filter(Undefined) ?? [],
    );

    const { data: watchlistEntry } = useWatchlistEntry(
        MediaType.Movie,
        movieId,
    );

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
        setRating(review?.rating ?? 0);
        setDescription(review?.description ?? "");
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const mediaIdValue = movieId ?? review?.movie.id;

        if (!(rating && mediaIdValue)) return;

        saveReview({
            ...review,
            reviewId,
            date: includeDate ? date.toISOString().split("T")[0] : undefined,
            movieId: mediaIdValue,
            venue,
            rating,
            description,
            company: company.map(({ value }) => ({ userId: value })),
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteWatchlistEntry({
                mediaId: mediaIdValue,
                mediaType: MediaType.Movie,
            });
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
                    companyOptions={filteredUsers}
                    rating={rating}
                    includeDate={includeDate}
                    date={date}
                    company={company}
                    description={description}
                    venue={venue}
                    starCount={configuration.ratings.starCount}
                    venueOptions={configuration.venues.knownVenueNames}
                    onRatingChange={setRating}
                    onIncludeDateChange={setIncludeDate}
                    onDateChange={setDate}
                    onCompanyChange={setCompany}
                    onDescriptionChange={setDescription}
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
            paddingBottom: padding.large,
        },
    });
