import type { FC } from "react";
import Octicons from "@react-native-vector-icons/octicons/static";
import { HeaderButton } from "expo-router/react-navigation";

import { HeaderIconAction } from "./headerIconAction";

interface MediaHeaderProps {
    onWatchlist?: boolean;
    onToggleWatchlist?: () => void;
    onAddReview?: () => void;
}

export const MediaHeaderButtons: FC<MediaHeaderProps> = ({
    onWatchlist,
    onAddReview,
    onToggleWatchlist,
}) => {
    return (
        <>
            {onToggleWatchlist && (
                <HeaderButton>
                    <HeaderIconAction
                        iconSet={Octicons}
                        variant="primary"
                        iconName={onWatchlist ? "eye-closed" : "eye"}
                        onPress={onToggleWatchlist}
                    />
                </HeaderButton>
            )}
            {onAddReview && (
                <HeaderButton>
                    <HeaderIconAction
                        iconSet={Octicons}
                        variant="primary"
                        iconName="plus"
                        onPress={onAddReview}
                    />
                </HeaderButton>
            )}
        </>
    );
};
