import { MediaType } from "@/constants/mediaTypes";
import {
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";
import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ImdbButton } from "./imdbButton";
import { TmdbButton } from "./tmdbButton";
import { VidSrcButton } from "./vidSrcButton";

interface MediaLinksProps {
    mediaType: MediaType;
    tmdbId?: number;
    imdbId?: string;
    seasonNumber?: number;
}

export const MediaLinks: FC<MediaLinksProps> = ({
    mediaType,
    tmdbId,
    imdbId,
    seasonNumber,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={styles.linksContainer}>
            {tmdbId && <TmdbButton tmdbId={tmdbId} mediaType={mediaType} />}
            {imdbId && (
                <>
                    <ImdbButton imdbId={imdbId} seasonNumber={seasonNumber} />
                    {![MediaType.Show, MediaType.Season].includes(
                        mediaType,
                    ) && <VidSrcButton imdbId={imdbId} />}
                </>
            )}
        </View>
    );
};

const createStyles = ({ theme: { padding } }: ThemedStyles) =>
    StyleSheet.create({
        linksContainer: {
            marginTop: padding.large,
            justifyContent: "center",
            flexDirection: "row",
            gap: padding.regular,
        },
    });
