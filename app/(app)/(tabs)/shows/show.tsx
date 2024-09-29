import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

import {
    MediaFooterButtons,
    MediaLinks,
    ParallaxScrollView,
    Poster,
    TmdbImage,
} from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useShow } from "@/modules/show";
import { useWatchlistEntry } from "@/modules/watchlistEntry";

const Show: React.FC = () => {
    const {
        mediaId: mediaIdParam,
        mediaTitle,
        mediaPosterUri,
    } = useLocalSearchParams<{
        mediaId: string;
        mediaTitle?: string;
        mediaPosterUri?: string;
    }>();

    const mediaId = Number.parseInt(mediaIdParam ?? "", 10);

    const { data: show } = useShow(mediaId);
    const { data: watchlistEntry } = useWatchlistEntry(MediaType.Show, mediaId);

    const firstAirDate = show?.firstAirDate
        ? new Date(show.firstAirDate).toLocaleString("default", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : undefined;

    const styles = useThemedStyles(createStyles, {});

    return (
        <>
            <Stack.Screen options={{ title: show?.name ?? mediaTitle }} />
            <ParallaxScrollView
                headerImage={
                    <TmdbImage type="backdrop" path={show?.backdropPath} />
                }
                contentInsetAdjustmentBehavior="always"
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.container}
                scrollIndicatorInsets={{ top: 330, bottom: 50 }}
            >
                <Poster
                    style={styles.floatingPoster}
                    size="small"
                    removeMargin
                    imageUri={show?.posterPath ?? mediaPosterUri}
                />
                <View style={styles.floatingTagline}>
                    <Text variant="heading" numberOfLines={3}>
                        {show?.tagline}
                    </Text>
                </View>
                <View style={styles.pageContent}>
                    <Text variant="body">{show?.overview}</Text>
                    {firstAirDate && (
                        <Text variant="bodyEmphasized" style={styles.section}>
                            {`Release Date: ${firstAirDate}`}
                        </Text>
                    )}
                </View>
                <MediaLinks
                    mediaType={MediaType.Show}
                    tmdbId={show?.id}
                    imdbId={show?.externalIds.imdbId}
                />
            </ParallaxScrollView>
            <MediaFooterButtons onWatchlist={!!watchlistEntry} />
        </>
    );
};

export default Show;

const createStyles = ({ theme: { color, padding } }: ThemedStyles) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: padding.pageHorizontal,
            paddingTop: padding.pageTop,
            paddingBottom: 80,
            backgroundColor: color.background,
            borderRadius: 16,
        },
        floatingPoster: {
            position: "absolute",
            top: -95,
            left: padding.pageHorizontal + padding.small,
            shadowColor: color.shadow,
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
        },
        floatingTagline: {
            left: padding.pageHorizontal + 125,
            top: -10,
            width: "60%",
            height: 70,
            justifyContent: "center",
        },
        pageContent: {
            marginTop: 20,
        },
        list: {
            marginTop: padding.large,
        },
        section: {
            marginTop: padding.large,
        },
    });
