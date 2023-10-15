import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { ProfileStyle } from "../styles/style";

const auth = getAuth();

const signOutUser = async (navigation) => {
  try {
    await auth.signOut();
    navigation.navigate("Login");
  } catch (e) {
    console.log(e);
  }
};

const Profile = () => {
  const navigation = useNavigation();

  return (
    <View style={ProfileStyle.container}>
      <Text style={ProfileStyle.title}>Profile screen for testing</Text>
      <Text style={ProfileStyle.subtitle}>Welcome to your profile!</Text>
      <View>
        <TouchableOpacity
          style={ProfileStyle.logoutButton}
          onPress={() => signOutUser(navigation)}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
