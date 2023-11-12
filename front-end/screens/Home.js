import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [calendarsList, setCalendarsList] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [eventsList, setEventsList] = useState(null);

  // user presses the button to log in with Google, and is redirected to Google's login page
  const [loginRequest, loginResponse, loginPrompt] = Google.useAuthRequest({
    iosClientId:
      "1085053377250-ikuv6tn9p3g1riofsp5ov5ucpdg51mof.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  // when loginResponse changes, check if it is a success and store the token
  const getAccessToken = async () => {
    if (loginResponse?.type === "success") {
      setToken(loginResponse.authentication.accessToken);
      getUserInfo();
    }
  };
  useEffect(() => {
    getAccessToken();
  }, [loginResponse]);

  // helper function to print user details to verify login
  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.log(error);
    }
  };

  // get all the calendars the user has access to
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

  // get all of today's events on the selected calendar
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        let eventsList = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events/`,
          {
            headers: { Authorization: `Bearer ${token}` },
            scopes: ["https://www.googleapis.com/auth/calendar"],
            timeMin: today.toISOString(),
            timeMax: tomorrow.toISOString(),
          }
        );
        const response = await eventsList.json();
        console.log(response);
        setEventsList(response.items);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    };
    fetchEvents();
  }, [calendarsList]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Goodscroll!</Text>
      <ScrollView>
        <Text>{JSON.stringify(userInfo, null, 2)}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Onboarding")}>
          <Text>Navigate to onboarding page</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => loginPrompt()}>
          <Text>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => getUsersCalendarList()}>
          <Text>Get Calendars</Text>
        </TouchableOpacity>
        <Text>Calendar List:</Text>
        {calendarsList?.map((calendar) => (
          <TouchableOpacity
            key={calendar.id}
            onPress={() => setSelectedCalendarId(calendar.id)}
            style={{ padding: 10, borderWidth: 1, marginBottom: 5 }}>
            <Text>{calendar.summary}</Text>
          </TouchableOpacity>
        ))}
        <Text>Selected Calendar ID: {selectedCalendarId}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});

export default Home;
