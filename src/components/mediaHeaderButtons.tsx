import type { FC } from "react";
import { Octicons } from "@expo/vector-icons";
import { HeaderButton } from "@react-navigation/elements";

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
