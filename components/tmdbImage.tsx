import type React from "react";
import type { StyleProp } from "react-native";
import { Image, type ImageStyle } from "expo-image";

type TmdbImageProps = {
    type: "poster" | "backdrop";
    path: string | undefined;
    style?: StyleProp<ImageStyle>;
};

export const TmdbImage: React.FunctionComponent<TmdbImageProps> = ({
    type,
    path,
    style,
}) => {
    return (
        <Image
            source={`https://image.tmdb.org/t/p/${type === "poster" ? "w780" : "w1280"}${path}`}
            style={[
                type === "poster"
                    ? {
                          height: 75,
                          width: 50,
                      }
                    : {
                          height: 300,
                          width: "100%",
                      },
                style,
            ]}
        />
    );
};

TmdbImage.displayName = "TmdbImage";
