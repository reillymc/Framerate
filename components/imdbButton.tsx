import { openURL } from "expo-linking";
import type React from "react";
import { Pressable } from "react-native";
import Svg, { Rect, G, Path } from "react-native-svg";

interface ImdbButtonProps {
    imdbId: string | undefined;
}

export const ImdbButton: React.FunctionComponent<ImdbButtonProps> = ({
    imdbId,
}) => {
    return (
        <Pressable
            onPress={() => openURL(`https://www.imdb.com/title/${imdbId}/`)}
        >
            <Svg width={64} height={32} viewBox="0 0 64 32">
                <Rect width="100%" height="100%" rx={4} fill="#F5C518" />
                <G transform="translate(8 7)">
                    <Path d="M0 18L5 18 5 0 0 0z" />
                    <Path d="M15.673 0l-1.12 8.408-.695-4.573A126.174 126.174 0 0013.278 0H7v18h4.242l.016-11.886L13.044 18h3.02l1.694-12.148L17.771 18H22V0h-6.327zM24 18V0h7.805A3.185 3.185 0 0135 3.177v11.646A3.185 3.185 0 0131.805 18H24zm5.832-14.76c-.198-.108-.577-.16-1.13-.16v11.811c.73 0 1.178-.13 1.346-.404.168-.27.254-1 .254-2.2v-6.98c0-.813-.03-1.333-.086-1.563a.736.736 0 00-.384-.504zM44.43 4.507h.32c1.795 0 3.25 1.406 3.25 3.138v7.217C48 16.595 46.545 18 44.75 18h-.32a3.282 3.282 0 01-2.658-1.332l-.288 1.1H37V0h4.784v5.78a3.387 3.387 0 012.646-1.273zm-1.024 8.777V9.02c0-.705-.046-1.167-.14-1.38-.094-.213-.47-.35-.734-.35s-.671.111-.75.299v7.219c.09.206.478.32.75.32.271 0 .666-.11.75-.32.082-.209.124-.719.124-1.523z" />
                </G>
            </Svg>
        </Pressable>
    );
};

ImdbButton.displayName = "ImdbButton";
