// import dependencies
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
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, database } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { generateSuggestion } from "../functions/openAI";
import { getGreeting } from "../functions/home";
import TallyMarks from "../components/tally";
import Svg, { Path } from "react-native-svg";

// import styling
import { colors } from "../styles/variables";
import { HomeStyle } from "../styles/style";

const Home = () => {
  // set up hooks
  const navigation = useNavigation();
  // get current goodscroll user's information
  const currentUser = auth.currentUser;
  // set up state variables
  const [apps, setApps] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
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

  // get the user's current streak count
  const getStreakCount = async () => {
    const userDocRef = doc(database, "streak", currentUser.uid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const currentStreak = docSnapshot.data().streak || 0;
        console.log("Current streak:", currentStreak);
        setStreak(currentStreak);
      } else {
        console.log("Streak document doesn't exist for this user.");
      }
    } catch (error) {
      console.error("Error getting streak:", error);
    }
  };

  // get the list of apps and the user's streak count when the screen is focused
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
        getUserInfo(token);
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
  const getUserInfo = async (token) => {
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
      navigation.navigate("CalendarSelection", { token });
    } catch (error) {
      console.log("getUserInfo returned an error: ", error);
    }
  };

  // get the user's selected calendar ID
  const getCalendarID = async () => {
    const userDocRef = doc(database, "calendar", currentUser.uid);
    try {
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const calendarId = docSnapshot.data().selectedCalendarId;
        setSelectedCalendarId(calendarId);
        console.log("Selected calendar ID", calendarId);
        await fetchEvents();
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
      tomorrow.setDate(today.getDate() + 3);

      const timeMin = today.toISOString();
      const timeMax = tomorrow.toISOString();

      let response = [];
      while (response.length === 0) {
        let eventsList = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendarId}/events/?timeMin=${timeMin}&timeMax=${timeMax}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        response = await eventsList.json();
        response = response?.items || [];

        response = response.filter((item) => item.status === "confirmed");
      }

      if (response) {
        console.log(JSON.stringify(response, null, 2));
        let summaries = await Promise.all(
          response.map(async (item) => {
            return `${item.summary}, ${item.start.dateTime}.`;
          })
        );
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

  const greeting = getGreeting();

  const getAppButton = (app) => {
    if (app === "Instagram") {
      return (
        <TouchableOpacity
          style={[HomeStyle.app, HomeStyle.instagram]}
          key={app}
          onPress={async () => {
            navigation.navigate("Timer", { appName: app });
          }}>
          <Text style={HomeStyle.appName}>{app}</Text>
        </TouchableOpacity>
      );
    } else if (app === "Twitter") {
      return (
        <TouchableOpacity
          style={[HomeStyle.app, HomeStyle.twitter]}
          key={app}
          onPress={async () => {
            navigation.navigate("Timer", { appName: app });
          }}>
          <Text style={HomeStyle.appName}>{app}</Text>
        </TouchableOpacity>
      );
    } else if (app === "TikTok") {
      return (
        <TouchableOpacity
          style={[HomeStyle.app, HomeStyle.tiktok]}
          key={app}
          onPress={async () => {
            navigation.navigate("Timer", { appName: app });
          }}>
          <Text style={HomeStyle.appName}>{app}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <ScrollView style={HomeStyle.container}>
      <View style={HomeStyle.banner}>
        <Text style={HomeStyle.bannerText}>
          Good {"\n"} {greeting}, {"\n"} {currentUser.displayName}.
        </Text>
      </View>
      <SafeAreaView style={HomeStyle.appContainer}>
        {apps?.map((index) => getAppButton(index))}
      </SafeAreaView>
      {streak > 0 ? (
        <View style={HomeStyle.streakContainer}>
          <TallyMarks streak={streak} />
        </View>
      ) : (
        <View style={HomeStyle.streakZeroContainer}>
          <Text style={HomeStyle.streakZeroText}>
            Close a distracting app before the timer expires to start your
            streak!
          </Text>
          <View style={HomeStyle.streakIcon}>
            <Image
              style={HomeStyle.streakIconImage}
              source={require("../assets/icons/close.png")}></Image>
          </View>
        </View>
      )}

      <View style={HomeStyle.boxContainer}>
        {userInfo === null ? (
          <>
          <TouchableOpacity
            style={HomeStyle.googleLogin}
            onPress={() => loginPrompt()}>
            <Text style={HomeStyle.googleLoginButton}>
              Login with Google to see suggested tasks!
            </Text>
          </TouchableOpacity>
          </>
          
          
        ) : (
          <TouchableOpacity style={HomeStyle.loggedIn} onPress={getCalendarID}>
            <Text style={HomeStyle.googleLoginButton}>Logged in</Text>
          </TouchableOpacity>
        )}
        {fetchedSummaries &&
          fetchedSummaries.length > 0 &&
          fetchedSummaries.map(
            (summary, index) =>
              summary !== "ignore" && (
                <TouchableOpacity
                  key={index}
                  style={[
                    HomeStyle.tasks,
                    { borderColor: getRandomStrokeColor() },
                  ]}>
                  <Text style={HomeStyle.googleLoginButton}>{summary}</Text>
                </TouchableOpacity>
              )
          )}
      </View>
    </ScrollView>
  );
};

export default Home;
