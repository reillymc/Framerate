import type { MediaType } from "@/constants/mediaTypes";
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
}

export const MediaLinks: FC<MediaLinksProps> = ({
    mediaType,
    tmdbId,
    imdbId,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <View style={styles.linksContainer}>
            {tmdbId && <TmdbButton tmdbId={tmdbId} mediaType={mediaType} />}
            {imdbId && (
                <>
                    <ImdbButton imdbId={imdbId} />
                    <VidSrcButton imdbId={imdbId} />
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
