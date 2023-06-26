import react from "react";
import { TouchableHighlight, Text, StyleSheet } from "react-native";

const BlueButton = (props) => {
    return (
        <TouchableHighlight
            onPress={props.onPress}
            activeOpacity={1}
            underlayColor="#005ce6"
            style={styles.button}
        >
            <Text style={styles.buttonText}>{props.buttonText}</Text>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "100%",
        height: 40,
        backgroundColor: "#06f",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
});

export default BlueButton;
