import { IconActionV2, Text } from "@reillymc/react-native-components";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
    return (
        <View>
            <Text>Watch list</Text>
            <Text>Recent Reviews</Text>
            <IconActionV2 size="large" iconName="plus-circle" />
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});
