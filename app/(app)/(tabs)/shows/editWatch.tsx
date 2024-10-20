import { SegmentedControl } from "@/components";
import { useShow } from "@/modules/show";
import { useDeleteShowEntry, useShowEntry } from "@/modules/showEntry";
import { useSaveShowReview, useShowReview } from "@/modules/showReview";
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
    const { reviewId, showId: showIdParam } = useGlobalSearchParams<{
        reviewId: string;
        showId: string;
    }>();

    const showId = showIdParam ? Number.parseInt(showIdParam, 10) : undefined;

    const { data: review } = useShowReview(reviewId);
    const { data: show } = useShow(showId ?? review?.show.id);
    const router = useRouter();
    const { mutate: saveReview } = useSaveShowReview();
    const { mutate: deleteWatchlistEntry } = useDeleteShowEntry();
    const { theme } = useTheme();

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );

    const [watchDateOption, setWatchDateOption] = useState<
        "today" | "custom" | "noDate"
    >(reviewId ? (review?.date ? "custom" : "noDate") : "today");

    const [clearWatchlistEntry, setClearWatchlistEntry] = useState(true);

    const { data: watchlistEntry } = useShowEntry(showId);

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const showIdValue = showId ?? review?.show.id;

        if (!showIdValue) return;

        saveReview({
            ...review,
            reviewId,
            date:
                watchDateOption === "noDate"
                    ? undefined
                    : date.toISOString().split("T")[0],
            showId: showIdValue,
        });

        if (watchlistEntry && clearWatchlistEntry && !reviewId) {
            deleteWatchlistEntry({ showId: showIdValue });
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
                    helpText={`${show?.name} is currently in your watchlist. ${
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
