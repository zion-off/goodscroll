import {
  SafeAreaView,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Linking,
  Platform,
  AppState,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/core";
// import { TimePicker } from 'react-native-simple-time-picker';

import * as Device from "expo-device";
import * as Notification from "expo-notifications";
import Constants from "expo-constants";
import {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
} from "expo-notifications";

import { TimerStyle } from "../styles/style";

Notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken, selectedMinutes) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "reminder",
    body: `tap here before the timer is up to add to your streak`,
    data: { timestamp: new Date().getTime(), selectedMinutes: selectedMinutes },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    Notification.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notification.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notification.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notification.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notification.getExpoPushTokenAsync({
      projectId:
        Constants.expoConfig?.extra?.eas?.projectId ||
        "ed1cdfcd-e636-419e-a223-1399bb8837f9",
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notification");
  }

  return token.data;
}

const Timer = () => {
  const route = useRoute();
  const { appName } = route.params;
  const [selectedMinutes, setSelectedMinutes] = useState(5);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const navigation = useNavigation();

  const [scheduledNotificationId, setScheduledNotificationId] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current = Notification.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    responseListener.current =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notification.removeNotificationSubscription(notificationListener.current);
      Notification.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const generateMinutesArray = () => {
    const minutes = [];
    for (let i = 5; i < 61; i++) {
      minutes.push(i);
    }
    return minutes;
  };

  // print selected minutes
  useEffect(() => {
    console.log(selectedMinutes);
  }, [selectedMinutes]);

  const scheduleNotification = async (delayInMinutes) => {
    const trigger = {
      seconds: (delayInMinutes - 5) * 60, // Convert minutes to seconds
      channelId: "default", // Replace with your notification channel ID
    };

    const notificationContent = {
      title: "reminder",
      body: `close ${appName} in 5 minutes`,
      data: {
        timestamp: new Date().getTime(),
        selectedMinutes: selectedMinutes,
      },
    };

    // Schedule the notification and store its identifier
    const scheduled = await scheduleNotificationAsync({
      content: notificationContent,
      trigger,
    });

    setScheduledNotificationId(scheduled.identifier);
  };

  // Function to cancel the scheduled notification
  const cancelScheduledNotification = async () => {
    if (scheduledNotificationId) {
      await cancelScheduledNotificationAsync(scheduledNotificationId);
      setScheduledNotificationId(null);
    }
  };

  const createOneButtonAlert = (appName) => {
    Alert.alert(`${appName} is not installed`, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  // app name to url mapping
  const appToUrl = async (appName) => {
    console.log("App name from appToUrl function: ", appName);
    if (appName === "Twitter") {
      try {
        await sendPushNotification(expoPushToken, selectedMinutes);
        await scheduleNotification(selectedMinutes);
        Linking.openURL("twitter://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    } else if (appName === "TikTok") {
      try {
        await sendPushNotification(expoPushToken, selectedMinutes);
        await scheduleNotification(selectedMinutes);
        Linking.openURL("tiktok://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    } else if (appName === "Instagram") {
      try {
        await sendPushNotification(expoPushToken, selectedMinutes);
        await scheduleNotification(selectedMinutes);
        Linking.openURL("instagram://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    }
  };
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    // Cleanup function
    return () => {
      appStateSubscription.remove(); // Remove the event listener on unmount
      cancelScheduledNotification(); // Cancel any scheduled notification on unmount
    };
  }, []); // Ensure the effect runs only once by passing an empty dependency array

  // Function to handle app state change
  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") {
      cancelScheduledNotification(); // Cancel the notification if app is brought to the foreground
      console.log("Scheduled notification cancelled.");
    }
  };

  useEffect(() => {
    responseListener.current =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);

        const notificationTime =
          response.notification.request.content.data.timestamp; // Timestamp of the notification
        const currentTime = new Date().getTime(); // Current time

        const timeDifferenceInMinutes =
          (currentTime - notificationTime) / (1000 * 60); // Convert milliseconds to minutes

        const date = new Date(notificationTime);

        const minutes =
          response.notification.request.content.data.selectedMinutes;

        console.log("Timestamp from notification data:", date);

        console.log("Time difference in minutes:", timeDifferenceInMinutes);

        console.log("Selected minutes:", minutes);

        // Compare if the time difference is less than selectedMinutes
        if (timeDifferenceInMinutes < minutes) {
          console.log("Navigating to Streak page");
          // If the notification was clicked before selectedMinutes passed, navigate to Streak page
          navigation.navigate("Streak");
        } else {
          console.log("Navigating to Home page");
          // If selectedMinutes has passed after the notification was clicked, navigate to Home page
          navigation.navigate("Home");
        }
      });

    return () => {
      Notification.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaView style={TimerStyle.container}>
      <View style={TimerStyle.textContainer}>
        <Text style={TimerStyle.text}>
          Open Goodscroll before {selectedMinutes} minutes to count towards your
          streak!
        </Text>
      </View>

      <Picker
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}>
        {generateMinutesArray().map((minute) => (
          <Picker.Item key={minute} label={`${minute}`} value={minute} />
        ))}
      </Picker>
      <TouchableOpacity
        style={TimerStyle.proceedButton}
        onPress={async () => {
          await appToUrl(appName);
        }}>
        <Text style={TimerStyle.buttonText}>Launch {appName}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Timer;
