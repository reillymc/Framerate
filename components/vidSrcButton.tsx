import { openURL } from "expo-linking";
import type React from "react";
import { Pressable } from "react-native";
import Svg, { G, Path, Rect } from "react-native-svg";

interface VidSrcButtonProps {
    imdbId: string | undefined;
    seasonNumber?: number;
    episodeNumber?: number;
}

export const VidSrcButton: React.FunctionComponent<VidSrcButtonProps> = ({
    imdbId,
    seasonNumber,
    episodeNumber,
}) => {
    const path =
        seasonNumber !== undefined && episodeNumber !== undefined
            ? "tv"
            : "movie";
    return (
        <Pressable
            onPress={() =>
                openURL(
                    `https://vidsrc.xyz/embed/${path}/${imdbId}/${seasonNumber !== undefined ? `${seasonNumber}/` : ""}${episodeNumber !== undefined ? `${episodeNumber}/` : ""}`,
                )
            }
        >
            <Svg viewBox="0 0 1600 650" width={80} height={32}>
                <G id="Layer">
                    <Rect width="100%" height="100%" rx={80} fill="#000" />
                    <Path
                        id="VIDSRC"
                        aria-label="VIDSRC"
                        d="M313.8 459h-61.7l-93.6-266.8h61.1l63 179.6 63.7-179.6h61.1zm187.3 0h-61.2V192.2h61.2zm108.8-35.7H659q26.1 0 26.1-17.8V245.7q0-17.9-26.1-17.9h-49.1zm-61.1-231.1h122.9q30.6 0 52.2 12.7 22.3 12.7 22.3 35v171.3q0 22.3-22.9 35-21 12.8-51.6 12.8H548.8z"
                        fill="#fff"
                    />
                    <Path
                        id="VIDSRC"
                        aria-label="VIDSRC"
                        d="M922.6 405.5v-57.9q0-17.9-26.1-17.9h-37.6q-49.7 0-68.8-26.7-6.3-8.9-6.3-20.4v-42.7q0-21.6 21.6-34.3 22.3-13.4 53.5-13.4h49.7q31.2 0 52.8 12.7 22.3 12.8 22.3 35v26.2h-61.1v-20.4q0-17.9-26.1-17.9H871q-26.1 0-26.1 17.9v30.5q0 19.1 26.1 17.9h37.6q31.2 0 52.8 12.7 22.3 12.7 22.3 35v69.4q0 22.3-22.9 35.1-21 12.7-52.2 12.7h-49.7q-49 0-68.8-27.4-6.3-8.9-6.3-20.4v-35.6h61.1v29.9q0 17.8 26.1 17.8h25.5q26.1 0 26.1-17.8zm168.1-100.6h49q26.1 0 26.1-17.8v-41.4q0-17.9-26.1-17.9h-49zm62.4 35.7L1241 459h-64.3l-86-115.8V459h-61.1V192.2h122.9q30.5 0 52.2 12.8 22.3 12.7 22.3 35v52.8q0 22.3-21.7 35.1-21.6 12.7-52.2 12.7zm198.7 82.8h18.5q25.4 0 25.4-17.8v-30h61.2v35.7q0 22.3-23 35-21 12.7-51.5 12.7h-42.7q-49 0-68.8-27.3-6.4-8.9-6.4-20.4V240q0-21.7 21.7-34.4 22.3-13.4 53.5-13.4h42.7q30.5 0 52.2 12.8 22.3 12.7 22.3 35v35.7h-61.2v-30q0-17.8-25.4-17.8h-18.5q-26.1 0-26.1 17.8v159.9q0 17.8 26.1 17.8z"
                        fill="#1a7cbc"
                    />
                </G>
            </Svg>
        </Pressable>
    );
};

VidSrcButton.displayName = "VidSrcButton";
