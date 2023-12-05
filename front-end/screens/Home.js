import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/core";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, database } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { colors } from "../styles/variables";

import { HomeStyle } from "../styles/style";

import { generateSuggestion } from "../functions/openAI";

const Home = () => {
  const currentUser = auth.currentUser;
  const [apps, setApps] = useState([]);

  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [calendarsList, setCalendarsList] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [eventsList, setEventsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [fetchedSummaries, setFetchedSummaries] = useState([]);

  // get list of apps from database

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

  const getStreakCount = async () => {
    const userDocRef = doc(database, "streak", currentUser.uid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const currentStreak = docSnapshot.data().streak || 0;
        console.log("Current streak:", currentStreak);
      } else {
        console.log("Streak document doesn't exist for this user.");
      }
    } catch (error) {
      console.error("Error getting streak:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAppsList();
      getStreakCount();
    }, [])
  );

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
      navigation.navigate("CalendarSelection");
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

  const getCalendarID = async () => {
    const userDocRef = doc(database, "calendar", currentUser.uid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        setSelectedCalendarId(docSnapshot.data().selectedCalendarId);
        console.log("Selected calendar ID", selectedCalendarId);
      } else {
        console.log("Could not retrieve calendar ID.");
      }
    } catch (error) {
      console.error("Error getting calendar ID:", error);
    }
  };

  // get all of today's events on the selected calendar
  const fetchEvents = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const timeMin = today.toISOString();
      const timeMax = tomorrow.toISOString();

      console.log(selectedCalendarId);

      await getCalendarID();

      let eventsList = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events/?timeMin=${timeMin}&timeMax=${timeMax}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      let response = await eventsList.json();
      response = await response.items.filter(
        (item) => item.status === "confirmed"
      );
      if (response) {
        console.log(JSON.stringify(response, null, 2));
        let summaries = await response?.map((item) => item.summary);
        console.log("Event Summaries:", summaries);
        setFetchedSummaries(await generateSuggestion(summaries));
        setEventsList(response.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const appIcon = (appName) => {
    if (appName === "Instagram") {
      return (
        <Image
          style={HomeStyle.appIcon}
          source={require("../assets/icons/twitter.png")}></Image>
      );
    } else if (appName === "Twitter") {
      return (
        <Image
          style={HomeStyle.appIcon}
          source={require("../assets/icons/instagram.png")}></Image>
      );
    } else if (appName === "TikTok") {
      return (
        <Image
          style={HomeStyle.appIcon}
          source={require("../assets/icons/tiktok.png")}></Image>
      );
    }
  };

  const getRandomStrokeColor = () => {
    // generate random number between 0 and 3
    const randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber === 0) {
      return colors.blueOne;
    }
    if (randomNumber === 1) {
      return colors.yellowTwo;
    }
    if (randomNumber === 2) {
      return colors.grayTwo;
    }
  };

  return (
    <SafeAreaView style={HomeStyle.container}>
      <ScrollView style={HomeStyle.subContainer}>
        <View style={HomeStyle.streakContainer}>
          <Text style={HomeStyle.streakNumber}>{streak}</Text>
          <Text style={HomeStyle.streakText}>
            Number of times you closed social media apps before the timer
            expired. Great going!
          </Text>
        </View>
        <SafeAreaView style={HomeStyle.appContainer}>
          {apps?.map((index) => (
            <TouchableOpacity
              style={HomeStyle.appButton}
              key={index}
              onPress={async () => {
                navigation.navigate("Timer", { appName: index });
              }}>
              {appIcon(index)}
            </TouchableOpacity>
          ))}
        </SafeAreaView>
        <View style={HomeStyle.boxContainer}>
          {userInfo === null ? (
            <TouchableOpacity
              style={HomeStyle.googleLogin}
              onPress={() => loginPrompt()}>
              <Text style={HomeStyle.googleLoginButton}>
                Login with Google to see suggested tasks!
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={HomeStyle.loggedIn} onPress={fetchEvents}>
              <Text style={HomeStyle.googleLoginButton}>Logged in</Text>
            </TouchableOpacity>
          )}
          {fetchedSummaries &&
            fetchedSummaries.length > 0 &&
            fetchedSummaries.map((summary, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  HomeStyle.tasks,
                  { borderColor: getRandomStrokeColor() },
                ]}>
                <Text style={HomeStyle.googleLoginButton}>{summary}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
