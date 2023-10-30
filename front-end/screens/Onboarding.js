import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { auth, database } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import { OnboardingStyle } from "../styles/style";

const Onboarding = () => {
  const navigation = useNavigation();
  const [selectedApps, setSelectedApps] = useState([]);
  const currentUser = auth.currentUser;

  const handleAppPress = (appName) => {
    if (selectedApps.includes(appName)) {
      setSelectedApps(selectedApps.filter((app) => app !== appName));
    } else {
      setSelectedApps([...selectedApps, appName]);
    }
  };

  const saveSelectedApps = async (userId, selectedApps) => {
    const userDocRef = doc(database, "apps", userId);
    await setDoc(userDocRef, {
      selectedApps: selectedApps,
    }, { merge: true });
    console.log("Selected apps saved successfully");
  };

  return (
    <View style={OnboardingStyle.container}>
      <Text style={OnboardingStyle.title}>
        Select the apps you'd like to use less...
      </Text>
      <View style={OnboardingStyle.appContainer}>
        <TouchableOpacity
          onPress={() => handleAppPress("Instagram")}
          style={[
            OnboardingStyle.app,
            selectedApps.includes("Instagram") && OnboardingStyle.selectedApp,
          ]}>
          <Image
            source={require("../assets/icons/instagram.png")}
            style={OnboardingStyle.appIcon}
          />
          <Text style={OnboardingStyle.appText}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAppPress("TikTok")}
          style={[
            OnboardingStyle.app,
            selectedApps.includes("TikTok") && OnboardingStyle.selectedApp,
          ]}>
          <Image
            source={require("../assets/icons/tiktok.png")}
            style={OnboardingStyle.appIcon}
          />
          <Text style={OnboardingStyle.appText}>TikTok</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAppPress("Twitter")}
          style={[
            OnboardingStyle.app,
            selectedApps.includes("Twitter") && OnboardingStyle.selectedApp,
          ]}>
          <Image
            source={require("../assets/icons/twitter.png")}
            style={OnboardingStyle.appIcon}
          />
          <Text style={OnboardingStyle.appText}>Twitter</Text>
        </TouchableOpacity>
      </View>
      {selectedApps.length > 0 && (
        <View style={OnboardingStyle.proceedButton}>
          <TouchableOpacity
            onPress={() => {
              const userId = currentUser.uid;
              saveSelectedApps(userId, selectedApps);
              navigation.navigate("Instructions");
            }}>
            <Text style={OnboardingStyle.appText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Onboarding;
