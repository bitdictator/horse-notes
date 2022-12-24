import react, { useState } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

const HorseCheckbox = (props) => {
    const [isChecked, setIsChecked] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => {
                setIsPressed(false);
            }}
            onPress={() => setIsChecked(!isChecked)}
            activeOpacity={1}
            underlayColor="#1c1c1c"
            style={
                isChecked
                    ? styles.buttonChecked
                    : isPressed
                    ? styles.buttonPressed
                    : styles.button
            }
        >
            <Text style={styles.buttonText}>{props.text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.04)",
    },
    buttonPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderColor: "#3C3C3C",
        borderWidth: 1,
    },
    buttonChecked: {
        backgroundColor: "#06f",
        borderRadius: 12,
        paddingHorizontal: 9,
        paddingVertical: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "normal",
    },
});

export default HorseCheckbox;
