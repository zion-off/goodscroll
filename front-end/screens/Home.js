import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, database } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import * as Linking from "expo-linking";

const Home = () => {
  const currentUser = auth.currentUser;
  const [apps, setApps] = useState([]);

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [calendarsList, setCalendarsList] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [eventsList, setEventsList] = useState(null);

  const createOneButtonAlert = (appName) => {
    Alert.alert(`${appName} is not installed`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  // get list of apps from database

  useEffect(() => {
    const getAppsList = async () => {
      const userDocRef = doc(database, "apps", currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setApps(docSnap.data().selectedApps);
          // print list of apps
          console.log(apps);
        }
      } catch (error) {
        console.log("Error getting apps list: ", error);
      }
    };
    getAppsList();
  }, []);

  // user presses the button to log in with Google, and is redirected to Google's login page
  const [loginRequest, loginResponse, loginPrompt] = Google.useAuthRequest({
    iosClientId:
      "1085053377250-ikuv6tn9p3g1riofsp5ov5ucpdg51mof.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  // save the access token to AsyncStorage
  const getAccessToken = () => {
    try {
      const token = loginResponse?.authentication?.accessToken;
      const refreshToken = loginResponse?.authentication?.refreshToken;

      if (token) {
        AsyncStorage.setItem("userToken", token);
        AsyncStorage.setItem("refreshToken", refreshToken);
        getUserInfo();
      }
    } catch (error) {
      console.error("getAccessToken returned an error: ", error);
    }
  };

  // when loginResponse changes, get the access token
  useEffect(() => {
    getAccessToken();
  }, [loginResponse]);

  // helper function to print user details to verify login
  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.log("getUserInfo returned an error: ", error);
    }
  };

  // get all the calendars the user has access to
  const getUsersCalendarList = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
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
        const token = await AsyncStorage.getItem("userToken");

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const timeMin = today.toISOString();
        const timeMax = tomorrow.toISOString();

        let eventsList = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events/?timeMin=${timeMin}&timeMax=${timeMax}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const response = await eventsList.json();
        const summaries = response?.items?.map((item) => item.summary);
        console.log("Event Summaries:", summaries);
        setEventsList(response.items);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    };
    fetchEvents();
  }, [selectedCalendarId]);

  /// test

  // Check if the access token is expired
  const isTokenExpired = () => {
    const expirationTime =
      loginResponse?.authentication?.accessTokenExpirationDate;
    return expirationTime && expirationTime < new Date();
  };

  // Refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      const iosClientId =
        "1085053377250-ikuv6tn9p3g1riofsp5ov5ucpdg51mof.apps.googleusercontent.com"; // Replace with your iOS client ID
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${iosClientId}&refresh_token=${refreshToken}&grant_type=refresh_token`,
      });

      const data = await response.json();

      if (data.access_token) {
        const newTokenExpirationDate = new Date();
        newTokenExpirationDate.setSeconds(
          newTokenExpirationDate.getSeconds() + data.expires_in
        );

        // Save the new access token and expiration date
        await AsyncStorage.setItem("userToken", data.access_token);
        await AsyncStorage.setItem(
          "tokenExpiration",
          newTokenExpirationDate.toISOString()
        );
      }
    } catch (error) {
      console.error("Error refreshing access token: ", error);
    }
  };

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (isTokenExpired()) {
        await refreshAccessToken();
      }
    };

    checkTokenExpiration();
  }, [loginResponse]);

  // test end

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>home page</Text>
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
        <Text>Apps the user wants to use less</Text>
        {apps?.map((index) => (
          <TouchableOpacity
            style={{ padding: 10, borderWidth: 1, marginBottom: 5 }}
            key={index}
            onPress={async () => {
              // await appToUrl(index);
              navigation.navigate("Timer", { appName: index });
            }}>
            <Text>{index}</Text>
          </TouchableOpacity>
        ))}
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
