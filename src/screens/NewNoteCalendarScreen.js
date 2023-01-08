import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import GoBackButton from "../components/buttons/GoBackButton";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";

const APP_BACKGROUND_COLOR = "#0f0f0f";
const DIVIDER_COLOR = "rgba(255, 255, 255, 0.1)";

LocaleConfig.locales["gr"] = {
    monthNames: [
        "Ιανουάριος",
        "Φεβρουάριος",
        "Μάρτιος",
        "Απρίλιος",
        "Μάιος",
        "Ιούνιος",
        "Ιούλιος",
        "Αύγουστος",
        "Σεπτέμβριος",
        "Οκτώβριος",
        "Νοέμβριος",
        "Δεκέμβριος",
    ],
    monthNamesShort: [
        "Ιαν.",
        "Φεβ.",
        "Μάρ",
        "Απρ",
        "Μάι",
        "Ιούν",
        "Ιούλ",
        "Αύγ",
        "Σεπ",
        "Οκτ",
        "Νοέ",
        "Δεκ,",
    ],
    dayNames: [
        "Κυριακή",
        "Δευτέρα",
        "Τρίτη",
        "Τετάρτη",
        "Πέμπτη",
        "Παρασκευή",
        "Σάββατο",
    ],
    dayNamesShort: ["Κυρ.", "Δευ.", "Τρ.", "Τετ.", "Πέμ.", "Παρ.", "Σάβ."],
    today: "Σήμερα",
};
LocaleConfig.defaultLocale = "gr";

const NewNoteCalendarScreen = ({ navigation, route }) => {
    const [todayDate, setTodayDate] = useState(moment().format("YYYY-MM-DD"));
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
        }
    }, [isFocused]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor={APP_BACKGROUND_COLOR} />
            <View style={styles.header}>
                <GoBackButton onPress={navigation.goBack} />
                <Text style={styles.headerTitle}>Νέα Σημείωση</Text>
            </View>
            <View style={styles.pageContentWrapper}>
                <Calendar
                    // Initially visible month. Default = now
                    //initialDate={"2022-12-15"}
                    current={todayDate}
                    // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
                    //minDate={"2012-05-10"}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    //maxDate={"2012-05-30"}
                    // Handler which gets executed on day press. Default = undefined
                    onDayPress={(day) => {
                        navigation.navigate("NewNote", {
                            noteDate: day.dateString,
                        });
                    }}
                    // Handler which gets executed on day long press. Default = undefined
                    // onDayLongPress={(day) => {
                    //     console.log("selected day", day);
                    // }}
                    // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
                    monthFormat={"MMMM yyyy"}
                    // Handler which gets executed when visible month changes in calendar. Default = undefined
                    onMonthChange={(month) => {}}
                    // Hide month navigation arrows. Default = false
                    //hideArrows={true}

                    // Replace default arrows with custom ones (direction can be 'left' or 'right')
                    //renderArrow={(direction) => <Arrow />}

                    // Do not show days of other months in month page. Default = false
                    hideExtraDays={true}
                    // If hideArrows = false and hideExtraDays = false do not switch month when tapping on greyed out
                    // day from another month that is visible in calendar page. Default = false
                    disableMonthChange={true}
                    // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
                    firstDay={1}
                    // Hide day names. Default = false
                    hideDayNames={false}
                    // Show week numbers to the left. Default = false
                    showWeekNumbers={false}
                    // Handler which gets executed when press arrow icon left. It receive a callback can go back month
                    onPressArrowLeft={(subtractMonth) => subtractMonth()}
                    // Handler which gets executed when press arrow icon right. It receive a callback can go next month
                    onPressArrowRight={(addMonth) => addMonth()}
                    // Disable left arrow. Default = false
                    disableArrowLeft={false}
                    // Disable right arrow. Default = false
                    disableArrowRight={false}
                    // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
                    disableAllTouchEventsForDisabledDays={true}
                    // Replace default month and year title with custom one. the function receive a date as parameter
                    // renderHeader={(date) => {
                    //     console.log(date);
                    //     /*Return JSX*/
                    //     return <Text>Test</Text>;
                    // }}
                    // Enable the option to swipe between months. Default = false
                    enableSwipeMonths={false}
                    style={{
                        marginHorizontal: 12,
                        marginVertical: 36,
                        borderRadius: 12,
                        padding: 2, // to hide bottom sharp corners bug
                    }}
                    theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#181818",
                        textSectionTitleColor: "#ffffff",
                        textSectionTitleDisabledColor: "#ffffff",
                        selectedDayBackgroundColor: "none",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#06f",
                        dayTextColor: "#ffffff",
                        textDisabledColor: "#d9e1e8",
                        dotColor: "#ffae00",
                        selectedDotColor: "#ffae00",
                        arrowColor: "#06f",
                        disabledArrowColor: "#d9e1e8",
                        monthTextColor: "#fff",
                        indicatorColor: "#fff",
                        textMonthFontWeight: "bold",
                        textMonthFontSize: 16,
                    }}
                    markingType={"custom"}
                    markedDates={{
                        [todayDate]: {
                            customStyles: {
                                text: {
                                    color: "#06f",
                                },
                            },
                        },
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_BACKGROUND_COLOR,
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        height: 60,
        padding: 12,
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: DIVIDER_COLOR,
    },
    headerTitle: {
        zIndex: -1,
        position: "absolute",
        textAlign: "center",
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        left: 0,
        right: 0,
    },
    pageContentWrapper: {
        flex: 1,
        width: "100%",
    },
});

export default NewNoteCalendarScreen;
