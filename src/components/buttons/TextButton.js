import react from "react";
import {
    TouchableHighlight,
    View,
    Image,
    Text,
    StyleSheet,
} from "react-native";

const TextButton = (props) => {
    return (
        <TouchableHighlight
            onPress={props.onPress}
            activeOpacity={1}
            underlayColor="rgba(255, 255, 255, 0.04)"
            style={styles.button}
        >
            <View>
                <Image source={"../assets/icons/" + props.iconName} />
                <Text style={styles.buttonText}>{props.buttonText}</Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingTop: 8,
        paddingRight: 12,
        paddingBottom: 8,
        paddingLeft: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    buttonText: {
        color: "#06f",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default TextButton;
