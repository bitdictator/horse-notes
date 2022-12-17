import React, { useState } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

const HorseCard = (props) => {
    const horseId = props.horseId;
    const [isPressed, setIsPressed] = useState(false);

    return (
        <Pressable
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={props.onPress}
            activeOpacity={1}
            underlayColor="#1c1c1c"
            style={isPressed ? styles.buttonPressed : styles.button}
        >
            <Text style={styles.buttonText}>{props.horseName}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 70,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        justifyContent: "center",
        borderRadius: 12,
        alignItems: "flex-start",
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.04)",
    },
    buttonPressed: {
        width: "100%",
        height: 70,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        justifyContent: "center",
        borderRadius: 12,
        alignItems: "flex-start",
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: "#3C3C3C",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
    },
});

export default HorseCard;
