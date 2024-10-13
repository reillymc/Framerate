import { SegmentedControl } from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useMovie } from "@/modules/movie";
import { useMovieReview, useSaveMovieReview } from "@/modules/movieReview";
import {
    useDeleteWatchlistEntry,
    useWatchlistEntry,
} from "@/modules/watchlistEntry";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Action,
    type ThemedStyles,
    ToggleInput,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const EditWatch: FC = () => {
    const { reviewId, movieId: movieIdParam } = useGlobalSearchParams<{
        reviewId: string;
        movieId: string;
    }>();

    const movieId = movieIdParam
        ? Number.parseInt(movieIdParam, 10)
        : undefined;

    const { data: review } = useMovieReview(reviewId);
    const { data: movie } = useMovie(movieId ?? review?.movie.id);
    const router = useRouter();
    const { mutate: saveReview } = useSaveMovieReview();
    const { mutate: deleteWatchlistEntry } = useDeleteWatchlistEntry();
    const { theme } = useTheme();

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );

    const [watchDateOption, setWatchDateOption] = useState<
        "today" | "custom" | "noDate"
    >(review?.date ? "custom" : "today");
    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);

    const { data: watchlistEntry } = useWatchlistEntry(
        MediaType.Movie,
        movieId,
    );

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const movieIdValue = movieId ?? review?.movie.id;

        if (!movieIdValue) return;

        saveReview({
            ...review,
            reviewId,
            date:
                watchDateOption === "noDate"
                    ? undefined
                    : date.toISOString().split("T")[0],
            movieId: movieIdValue,
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteWatchlistEntry({
                mediaId: movieIdValue,
                mediaType: MediaType.Movie,
            });
        }
        handleClose();
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: reviewId ? "Edit Watch" : "Log Watch",
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
            <StatusBar barStyle="light-content" animated />
            <ScrollView
                contentContainerStyle={styles.container}
                contentInsetAdjustmentBehavior="automatic"
            >
                <SegmentedControl
                    value={watchDateOption}
                    options={
                        [
                            { value: "today", label: "Today" },
                            { value: "custom", label: "Custom Date" },
                            { value: "noDate", label: "No Date" },
                        ] as const
                    }
                    onChange={({ value }) => setWatchDateOption(value)}
                />

                {watchDateOption !== "noDate" && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        style={styles.dateInput}
                        disabled={watchDateOption === "today"}
                        maximumDate={new Date()}
                        onChange={(_, newDate) => newDate && setDate(newDate)}
                        accentColor={theme.color.primary}
                    />
                )}
            </ScrollView>
            {!!watchlistEntry && !reviewId && (
                <ToggleInput
                    style={styles.watchlistConfirm}
                    label="Mark as watched"
                    value={clearWatchlistEntry}
                    onChange={setClearWatchlistEntry}
                    helpText={`${movie?.title} is currently in your watchlist. ${
                        clearWatchlistEntry
                            ? "It will be removed when this watch is logged."
                            : "It will remain there after this watch is logged."
                    }`}
                />
            )}
        </>
    );
};

export default EditWatch;

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: padding.navigationActionHorizontal,
        },
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingBottom: padding.large,
        },
        dateInput: {
            marginTop: padding.regular,
            alignSelf: "center",
            marginRight: padding.small,
        },
        watchlistConfirm: {
            paddingHorizontal: padding.pageHorizontal,
            bottom: padding.pageBottom,
        },
    });
