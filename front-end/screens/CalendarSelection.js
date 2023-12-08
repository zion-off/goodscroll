import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, database } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";

import { CalendarSelectionStyle } from "../styles/style";

const CalendarSelection = ({ route }) => {
  const { token } = route.params;
  const navigation = useNavigation();
  const [calendarsList, setCalendarsList] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const currentUser = auth.currentUser;

  // get all the calendars the user has access to
  useEffect(() => {
    const getUsersCalendarList = async () => {
      try {
        
        let calendarsList = await fetch(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const response = await calendarsList.json();
        console.log(JSON.stringify(response, null, 2));
        setCalendarsList(response.items);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    };

    getUsersCalendarList();
  }, []);

  const saveSelectedCalendar = async (userId, selectedCalendarId) => {
    const userDocRef = doc(database, "calendar", userId);
    await setDoc(
      userDocRef,
      {
        selectedCalendarId: selectedCalendarId,
      },
      { merge: true }
    );
    console.log("Selected calendar saved successfully");
  };

  return (
    <SafeAreaView style={CalendarSelectionStyle.container}>
      <Text style={CalendarSelectionStyle.text}>
        Goodscroll automatically generates task suggestions based on your
        calendar events. Pick your work calendar, so Goodscroll knows which
        events to work with!
      </Text>
      <View style={CalendarSelectionStyle.calendarContainer}>
        {calendarsList?.map((calendar) => (
          <TouchableOpacity
            key={calendar.id}
            onPress={() => setSelectedCalendarId(calendar.id)}
            style={[
              CalendarSelectionStyle.calendars,
              calendar.id === selectedCalendarId &&
                CalendarSelectionStyle.selectedCalendar,
            ]}>
            <Text>{calendar.summary}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedCalendarId !== null && (
        <View style={CalendarSelectionStyle.proceedButton}>
          <TouchableOpacity
            onPress={() => {
              const userId = currentUser.uid;
              saveSelectedCalendar(userId, selectedCalendarId);
              navigation.navigate("Home");
            }}>
            <Text style={CalendarSelectionStyle.appText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CalendarSelection;
