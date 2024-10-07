import { MediaLinks, TmdbImage, VidSrcButton } from "@/components";
import { MediaType } from "@/constants/mediaTypes";
import { useSeason } from "@/modules/season";
import { useShow } from "@/modules/show";
import {
    Text,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet, View, useWindowDimensions } from "react-native";

const Season: React.FC = () => {
    const {
        showId: showIdParam,
        seasonNumber: seasonNumberParam,
        name,
    } = useLocalSearchParams<{
        showId: string;
        seasonNumber: string;
        name?: string;
    }>();

    const showId = Number.parseInt(showIdParam ?? "", 10);
    const seasonNumber = Number.parseInt(seasonNumberParam ?? "", 10);
    const { fontScale, width } = useWindowDimensions();

    const { data: show } = useShow(showId);
    const { data: season } = useSeason(showId, seasonNumber);

    const airDate = season?.airDate
        ? new Date(season.airDate).toLocaleString("default", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : undefined;

    const styles = useThemedStyles(createStyles, { fontScale, width });

    return (
        <>
            <Stack.Screen options={{ title: season?.name ?? name }} />
            <FlatList
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={styles.container}
                data={season?.episodes}
                keyExtractor={({ episodeNumber }) => episodeNumber.toString()}
                ListHeaderComponent={
                    <>
                        <Text variant="body">{season?.overview}</Text>
                        {airDate && (
                            <Text
                                variant="bodyEmphasized"
                                style={styles.topMargin}
                            >
                                {`First Aired: ${airDate}`}
                            </Text>
                        )}
                        <MediaLinks
                            mediaType={MediaType.Season}
                            imdbId={show?.externalIds.imdbId}
                            seasonNumber={seasonNumber}
                        />
                        <Text variant="title" style={styles.topMargin}>
                            Episodes
                        </Text>
                    </>
                }
                renderItem={({ item }) => {
                    const airDate = item?.airDate
                        ? new Date(item.airDate).toLocaleString("default", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                          })
                        : undefined;

                    return (
                        <View style={styles.episode}>
                            <View style={styles.episodeInnerContainer}>
                                <TmdbImage
                                    path={item.stillPath ?? show?.backdropPath}
                                    type="backdrop"
                                    style={styles.episodeImage}
                                />
                                <View style={styles.episodeDetails}>
                                    <View>
                                        {item.name && (
                                            <Text variant="caption">
                                                {`Episode ${item.episodeNumber}`}
                                            </Text>
                                        )}
                                        <Text
                                            variant="heading"
                                            numberOfLines={2}
                                        >
                                            {item.name ??
                                                `Episode ${item.episodeNumber}`}
                                        </Text>
                                    </View>
                                    {airDate && (
                                        <Text variant="body">{airDate}</Text>
                                    )}
                                </View>
                            </View>
                            {item.overview && (
                                <Text variant="caption">{item.overview}</Text>
                            )}
                            <VidSrcButton
                                imdbId={show?.externalIds.imdbId}
                                episodeNumber={item.episodeNumber}
                                seasonNumber={seasonNumber}
                            />
                        </View>
                    );
                }}
            />
        </>
    );
};

export default Season;

const createStyles = (
    { theme: { padding, border } }: ThemedStyles,
    { fontScale, width }: { fontScale: number; width: number },
) => {
    const imageAspect = 5 / 7;
    const imageWidth = Math.floor(width * (2 / 5));
    const imageHeight = Math.floor(imageWidth * imageAspect * fontScale);

    return StyleSheet.create({
        container: {
            paddingBottom: 80,
            paddingHorizontal: padding.pageHorizontal,
        },
        topMargin: {
            marginTop: padding.large,
        },
        episode: {
            marginVertical: padding.regular,
            gap: padding.small,
        },
        episodeImage: {
            width: imageWidth,
            height: imageHeight,
            borderRadius: border.radius.regular,
        },
        episodeInnerContainer: {
            flexDirection: "row",
        },
        episodeDetails: {
            flex: 1,
            marginLeft: padding.small,
            justifyContent: "space-between",
        },
    });
};
