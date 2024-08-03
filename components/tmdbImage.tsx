import type React from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";

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
            src={`https://image.tmdb.org/t/p/${type === "poster" ? "w500" : "w780"}${path}`}
            style={[
                type === "poster"
                    ? {
                          height: 75,
                          width: 50,
                      }
                    : {
                          height: 250,
                          width: "100%",
                      },
                style,
            ]}
        />
    );
};

TmdbImage.displayName = "TmdbImage";
