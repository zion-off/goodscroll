import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { ProfileStyle } from "../styles/style";

const auth = getAuth();

const Profile = () => {
  const navigation = useNavigation();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const signOutUser = async (navigation) => {
    try {
      await auth.signOut();
      navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  const handleChangeEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail);
      Alert.alert("Success", "Email address updated successfully.");
      setNewEmail("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert("Success", "Password updated successfully.");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    const fetchDisplayName = async () => {
      const user = auth.currentUser;
      if (user && user.displayName) {
        setDisplayName(user.displayName);
        console.log("user's name: ", user.displayName)
      }
    };
    fetchDisplayName();
  }, []);

  return (
    <View style={ProfileStyle.container}>
      <Text style={ProfileStyle.title}>Hello, {displayName}!</Text>
      <View style={ProfileStyle.inputContainer}>
        <TextInput
          style={ProfileStyle.input}
          placeholder="Enter new email"
          value={newEmail}
          onChangeText={(text) => setNewEmail(text)}
        />
        <TouchableOpacity
          style={ProfileStyle.changeEmailButton}
          onPress={handleChangeEmail}>
          <Text>Change Email</Text>
        </TouchableOpacity>
      </View>

      <View style={ProfileStyle.inputContainer}>
        <TextInput
          style={ProfileStyle.input}
          placeholder="Enter new password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
        />
        <TouchableOpacity
          style={ProfileStyle.changeEmailButton}
          onPress={handleChangePassword}>
          <Text style={ProfileStyle.input}>Change Password</Text>
        </TouchableOpacity>
      </View>

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
