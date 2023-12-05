import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
import { ProfileStyle } from "../styles/style";
import { Svg, Path } from "react-native-svg";

const auth = getAuth();

const Profile = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");
  const [newName, setNewName] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);

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
        console.log("user's name: ", user.displayName);
      }
    };
    fetchDisplayName();
  }, []);

  return (
    <SafeAreaView style={ProfileStyle.container}>
      <View style={ProfileStyle.linkContainer}>
        <View style={ProfileStyle.title}>
          <Text style={ProfileStyle.hello}>Hello, </Text>
          {editingName ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={ProfileStyle.input}
                placeholder="new name"
                value={newName}
                onChangeText={(text) => setNewName(text)}
              />
              <TouchableOpacity onPress={() => setEditingName(false)}>
                <Svg
                  width="18"
                  height="13"
                  viewBox="0 0 18 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M1 7L5.94975 11.9497L16.5572 1.34326"
                    stroke="black"
                    strokeWidth={3}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingName(false)}>
                <Svg
                  style={{ marginLeft: 20 }}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <Path
                    d="M13 13L7.00002 7.00002M7.00002 7.00002L1 1M7.00002 7.00002L13 1M7.00002 7.00002L1 13"
                    stroke="black"
                    strokeWidth={3}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => setEditingName(true)}>
                <Text style={ProfileStyle.link}>{displayName}</Text>
              </TouchableOpacity>
              <Text style={ProfileStyle.hello}>!</Text>
            </View>
          )}
        </View>

        {editingEmail ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={ProfileStyle.input}
              placeholder="New email"
              value={newEmail}
              onChangeText={(text) => setNewEmail(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setEditingEmail(false);
                handleChangeEmail;
              }}>
              <Svg
                width="18"
                height="13"
                viewBox="0 0 18 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M1 7L5.94975 11.9497L16.5572 1.34326"
                  stroke="black"
                  strokeWidth={3}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingEmail(false)}>
              <Svg
                style={{ marginLeft: 20 }}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M13 13L7.00002 7.00002M7.00002 7.00002L1 1M7.00002 7.00002L13 1M7.00002 7.00002L1 13"
                  stroke="black"
                  strokeWidth={3}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setEditingEmail(true)}>
              <Text style={ProfileStyle.link}>Change your email</Text>
            </TouchableOpacity>
          </View>
        )}
        {editingPassword ? (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={ProfileStyle.input}
              secureTextEntry={true}
              placeholder="New password"
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
            <TouchableOpacity
              onPress={() => {
                setEditingPassword(false);
                handleChangePassword;
              }}>
              <Svg
                width="18"
                height="13"
                viewBox="0 0 18 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M1 7L5.94975 11.9497L16.5572 1.34326"
                  stroke="black"
                  strokeWidth={3}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingPassword(false)}>
              <Svg
                style={{ marginLeft: 20 }}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Path
                  d="M13 13L7.00002 7.00002M7.00002 7.00002L1 1M7.00002 7.00002L13 1M7.00002 7.00002L1 13"
                  stroke="black"
                  strokeWidth={3}
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setEditingPassword(true)}>
              <Text style={ProfileStyle.link}>Change your password</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity onPress={() => navigation.navigate("Onboarding")}>
          <Text style={ProfileStyle.link}>Edit social apps</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => signOutUser(navigation)}>
          <Text style={ProfileStyle.link}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
