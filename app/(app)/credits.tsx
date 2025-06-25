import type { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import {
    Action,
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { SvgCssUri } from "react-native-svg/css";

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
                    <SvgCssUri
                        width={80}
                        height={50}
                        uri={
                            "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
                        }
                    />
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
