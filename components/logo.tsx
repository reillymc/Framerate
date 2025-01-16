import { ImageResources } from "@/assets/images";
import { type FC, useMemo } from "react";
import { Image } from "react-native";

interface LogoProps {
    size?: "small" | "medium" | "large";
}

export const Logo: FC<LogoProps> = ({ size = "medium" }) => {
    const iconSize = useMemo(() => {
        switch (size) {
            case "small":
                return 40;
            case "medium":
                return 60;
            case "large":
                return 80;
        }
    }, [size]);

    return (
        <Image
            source={ImageResources.splash}
            style={{ width: iconSize, height: iconSize }}
        />
    );
};
