import { Icon, Tag, Text } from "@reillymc/react-native-components";
import React, {
    Children,
    type FC,
    type ReactElement,
    type ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";

interface WebDropdownMenuProps {
    trigger: ReactNode;
    children?:
        | ReactElement<MenuOptionProps | MenuDecoratorProps>
        | Array<ReactElement<MenuOptionProps | MenuDecoratorProps>>;
    dropdownWidth?: number;
}

export const WebDropdownMenu: FC<WebDropdownMenuProps> = ({
    trigger,
    children,
    dropdownWidth = 280,
}) => {
    const triggerRef = useRef<View>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

    const [visible, setVisible] = useState(false);

    const { width: screenWidth } = useWindowDimensions();

    useEffect(() => {
        if (triggerRef.current && visible) {
            triggerRef.current.measure((fx, fy, width, height, px, py) => {
                setPosition({
                    x: px,
                    y: py + height,
                    width: width,
                });
            });
        }
    }, [visible]);

    const parsedChildren = useMemo(
        () =>
            Children.map(children, (child) => {
                if (!child) return undefined;
                const props = child.props;
                if ("onSelect" in props) {
                    return React.cloneElement(child, {
                        ...props,
                        onSelect: () => {
                            setVisible(false);
                            props.onSelect();
                        },
                    });
                }
                return child;
            }),
        [children],
    );

    return (
        <View>
            <Pressable onPress={() => setVisible(true)}>
                <View ref={triggerRef}>{trigger}</View>
            </Pressable>
            {visible && (
                <Modal
                    transparent
                    visible={visible}
                    onRequestClose={() => setVisible(false)}
                >
                    <Pressable
                        onPress={() => setVisible(false)}
                        style={styles.modalOverlay}
                    >
                        <View
                            style={[
                                styles.menu,
                                {
                                    top: position.y + 8,
                                    left:
                                        position.x + dropdownWidth > screenWidth
                                            ? position.x -
                                              dropdownWidth +
                                              position.width
                                            : position.x,
                                },
                            ]}
                        >
                            {parsedChildren}
                        </View>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    menu: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        width: 280,
        elevation: 8,
        gap: 8,
    },
    menuOption: {
        padding: 5,
    },
});

export type MenuOptionProps = {
    onSelect: () => void;
    children: ReactNode;
};

export const MenuOption: FC<MenuOptionProps> = ({ onSelect, children }) => {
    return (
        <Pressable onPress={onSelect} style={styles.menuOption}>
            {children}
        </Pressable>
    );
};

export type MenuDecoratorProps = {
    children: ReactNode;
};

export const MenuDecorator: FC<MenuDecoratorProps> = ({ children }) => children;

export type MenuOptionContentToggleProps = {
    title: string;
    selected?: boolean;
};

export const MenuOptionContentToggle: FC<MenuOptionContentToggleProps> = ({
    title,
    selected,
}: MenuOptionContentToggleProps) => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
            }}
        >
            <Text lineBreakMode="tail" numberOfLines={1}>
                {title}
            </Text>
            {selected && <Icon set="octicons" iconName="check" />}
        </View>
    );
};

export type DropdownButtonProps = {
    label: string;
};

export const DropdownButton: FC<DropdownButtonProps> = ({ label }) => {
    return (
        <Tag
            label={label}
            variant="light"
            iconName="down"
            style={{
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                gap: 4,
            }}
        />
    );
};
