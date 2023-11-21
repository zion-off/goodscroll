import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { ProfileStyle } from "../styles/style";

const auth = getAuth();

const Profile = () => {
  const navigation = useNavigation();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState('');

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

  return (
    <View style={ProfileStyle.container}>
      <Text style={ProfileStyle.title}>Profile screen for testing</Text>
      <Text style={ProfileStyle.subtitle}>Welcome to your profile!</Text>
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
