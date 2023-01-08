import React, { useState } from "react";
import { Pressable, Text, StyleSheet, Image } from "react-native";

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
            <Image
                style={styles.horseImg}
                source={{ uri: props.imageSource }}
            />
            <Text style={styles.buttonText}>{props.horseName}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: 70,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        justifyContent: "center",
        borderRadius: 6,
        alignItems: "flex-start",
        paddingLeft: 6,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.04)",
    },
    buttonPressed: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: 70,
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        justifyContent: "center",
        borderRadius: 12,
        alignItems: "flex-start",
        paddingLeft: 6,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: "#3C3C3C",
    },
    buttonText: {
        flex: 1,
        color: "#fff",
        fontSize: 18,
        alignSelf: "center",
        marginLeft: 6,
    },
    horseImg: {
        height: 58,
        width: 58,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.4)",
    },
});

export default HorseCard;
