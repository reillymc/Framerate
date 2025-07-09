import type { FC } from "react";
import { StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";
import {
    IconAction,
    type ThemedStyles,
    useThemedStyles,
} from "@reillymc/react-native-components";

interface HeaderCloseActionProps {
    onClose: () => void;
}

export const HeaderCloseAction: FC<HeaderCloseActionProps> = ({ onClose }) => {
    const styles = useThemedStyles(createStyles, {});

    return (
        <IconAction
            iconSet={Octicons}
            iconName="x"
            containerStyle={styles.headerAction}
            onPress={onClose}
        />
    );
};

const createStyles = ({ theme: { spacing } }: ThemedStyles) =>
    StyleSheet.create({
        headerAction: {
            marginRight: spacing.large + spacing.small,
            borderRadius: "50%",
            alignItems: "center",
            justifyContent: "center",
        },
    });
