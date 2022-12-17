import TextButton from "./TextButton";

const GoBackButton = (props) => {
    return (
        <TextButton
            onPress={props.onPress}
            buttonText={props.buttonText ? props.buttonText : "Πίσω"}
        />
    );
};

export default GoBackButton;
