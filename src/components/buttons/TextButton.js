import react from "react";
import {
    TouchableHighlight,
    View,
    Image,
    Text,
    StyleSheet,
} from "react-native";

const TextButton = (props) => {
    const reg = /^#([0-9a-f]{3}){1,2}$/i; // regular expression for 3 and 6 length hex color
    const textColor = reg.test(props.color) ? props.color : "#ffffff";

    return (
        <TouchableHighlight
            onPress={props.onPress}
            activeOpacity={1}
            underlayColor="rgba(255, 255, 255, 0.04)"
            style={styles().button}
        >
            <View>
                <Text style={styles(textColor).buttonText}>
                    {props.buttonText}
                </Text>
            </View>
        </TouchableHighlight>
    );
};

const styles = (textColor) =>
    StyleSheet.create({
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
            color: textColor,
            fontSize: 16,
            fontWeight: "bold",
        },
    });

export default TextButton;
