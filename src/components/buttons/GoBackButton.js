import TextButton from "./TextButton";

const GoBackButton = (props) => {
    return (
        <TextButton
            onPress={props.onPress}
            buttonText={props.buttonText ? props.buttonText : "Πίσω"}
            color={"#06f"}
        />
    );
};

export default GoBackButton;
