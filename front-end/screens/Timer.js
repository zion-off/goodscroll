import {
  SafeAreaView,
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from "react";
import { Picker } from "@react-native-picker/picker";
// import { TimePicker } from 'react-native-simple-time-picker';

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
} from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
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
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId || "ed1cdfcd-e636-419e-a223-1399bb8837f9",
    });
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token.data;
}

const Timer = () => {
  const route = useRoute();
  const { appName } = route.params;
  const [selectedMinutes, setSelectedMinutes] = useState(0);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [scheduledNotificationId, setScheduledNotificationId] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const generateMinutesArray = () => {
    const minutes = [];
    for (let i = 0; i < 60; i++) {
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
      seconds: delayInMinutes * 60, // Convert minutes to seconds
      channelId: "default", // Replace with your notification channel ID
    };

    const notificationContent = {
      title: "Your Title",
      body: "Your notification message here",
      data: { someData: "goes here" },
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

  // Effect to cancel scheduled notification when the component unmounts
  useEffect(() => {
    return () => {
      cancelScheduledNotification();
    };
  }, []);

  // app name to url mapping
  const appToUrl = async (appName) => {
    console.log("App name from appToUrl function: ", appName);
    if (appName === "Twitter") {
      try {
        await scheduleNotification(selectedMinutes);
        Linking.openURL("twitter://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    } else if (appName === "TikTok") {
      try {
        await scheduleNotification(selectedMinutes);
        Linking.openURL("tiktok://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    } else if (appName === "Instagram") {
      try {
        await scheduleNotification(selectedMinutes);
        Linking.openURL("instagram://");
      } catch (error) {
        console.log("Error opening app: ", error);
        createOneButtonAlert(appName);
      }
    }
  };

  cancelScheduledNotification();

  return (
    <SafeAreaView>
      <Text>Timer</Text>
      <Picker
        selectedValue={selectedMinutes}
        onValueChange={(itemValue) => setSelectedMinutes(itemValue)}>
        {generateMinutesArray().map((minute) => (
          <Picker.Item key={minute} label={`${minute}`} value={minute} />
        ))}
      </Picker>
      <Text>
        Open Goodscroll before {selectedMinutes} minutes to count towards your
        streak!
      </Text>
      <TouchableOpacity
        onPress={async () => {
          await appToUrl(appName);
        }}>
        <Text>Launch {appName}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Timer;
