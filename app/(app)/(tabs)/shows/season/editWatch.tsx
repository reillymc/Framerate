import { SegmentedControl } from "@/components";
import { useSaveSeasonReview, useSeasonReview } from "@/modules/seasonReview";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Action,
    type ThemedStyles,
    useTheme,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { type FC, useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const EditWatch: FC = () => {
    const {
        reviewId,
        showId: showIdParam,
        seasonNumber: seasonNumberParam,
    } = useGlobalSearchParams<{
        reviewId: string;
        showId: string;
        seasonNumber: string;
    }>();

    const showId = showIdParam ? Number.parseInt(showIdParam, 10) : undefined;

    const seasonNumber = seasonNumberParam
        ? Number.parseInt(seasonNumberParam, 10)
        : undefined;

    const { data: review } = useSeasonReview(reviewId);
    const router = useRouter();
    const { mutate: saveReview } = useSaveSeasonReview();
    const { theme } = useTheme();

    const styles = useThemedStyles(createStyles, {});

    const [date, setDate] = useState(
        review?.date ? new Date(review.date) : new Date(),
    );

    const [watchDateOption, setWatchDateOption] = useState<
        "today" | "custom" | "noDate"
    >(reviewId ? (review?.date ? "custom" : "noDate") : "today");

    useEffect(() => {
        setDate(review?.date ? new Date(review.date) : new Date());
    }, [review]);

    const handleClose = () => {
        router.back();
    };

    const handleSave = () => {
        const showIdValue = showId ?? review?.season.showId;
        const seasonNumberValue = seasonNumber ?? review?.season.seasonNumber;

        if (!(showIdValue && seasonNumberValue)) return;

        saveReview({
            ...review,
            reviewId,
            date:
                watchDateOption === "noDate"
                    ? undefined
                    : date.toISOString().split("T")[0],
            showId: showIdValue,
            seasonNumber: seasonNumberValue,
        });

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
    });
