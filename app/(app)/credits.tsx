import { TmdbButton } from "@/components";
import {
    Action,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useRouter } from "expo-router";
import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Credits: FC = () => {
    const router = useRouter();
    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Credits",
                    headerLeft: () => (
                        <Action label="Done" onPress={router.back} />
                    ),
                }}
            />
            <ScrollView
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                automaticallyAdjustKeyboardInsets
                contentContainerStyle={styles.container}
            >
                <Text>
                    The Framerate project is developed, maintained and operated
                    by Reilly MacKenzie-Cree.
                </Text>
                <Text variant="label" style={styles.sectionHeading}>
                    Film and TV Data
                </Text>
                <View style={styles.tmdbAttribution}>
                    <TmdbButton width={76} />
                    <Text style={styles.tmdbText} variant="bodyEmphasized">
                        Framerate uses the TMDB API but is not endorsed or
                        certified by TMDB.
                    </Text>
                </View>
                <Text style={styles.sectionElement}>
                    All film and television data used in Framerate, including
                    cast details, synopsis, release dates and poster art is
                    supplied by The Movie Database.
                </Text>

                <Text variant="label" style={styles.sectionHeading}>
                    User, Rating and Watchlist Data
                </Text>
                <Text>
                    All data relating to user accounts, including personal
                    details, media ratings, watchlist entries, saved venues and
                    company is processed and stored by Framerate.
                </Text>
            </ScrollView>
        </>
    );
};

const createStyles = ({ theme: { spacing, color } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: spacing.pageHorizontal,
            paddingTop: spacing.pageTop,
        },
        sectionHeading: {
            marginTop: spacing.large,
        },
        sectionElement: {
            paddingTop: spacing.small,
        },
        tmdbAttribution: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: color.background,
        },
        tmdbText: {
            flexWrap: "wrap",
            marginLeft: spacing.medium,
            flexShrink: 1,
        },
    });

export default Credits;
