import type { FC } from "react";
import { StyleSheet } from "react-native";
import {
    Action,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

interface HeaderCloseActionProps {
    label?: string;
    onClose: () => void;
}

export const HeaderCloseAction: FC<HeaderCloseActionProps> = ({
    label = "Close",
    onClose,
}) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <Action
            label={label}
            containerStyle={styles.headerAction}
            onPress={onClose}
        />
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginHorizontal: spacing.navigationActionHorizontal,
        },
    });
