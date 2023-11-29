import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { CommonActions } from "@react-navigation/routers";

import { RegisterStyle } from "../styles/style";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // authentication function
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        return updateProfile(user, {
          displayName: name,
        });
      })
      .then(() => {
        // Now the profile update is completed, fetch the updated user
        const user = auth.currentUser;
        console.log("user's name: ", user.displayName);
        setLoading(false);
        navigation.dispatch(
          CommonActions.navigate({
            name: "Onboarding",
          })
        );
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  // check for logged in state
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.dispatch(
          CommonActions.navigate({
            name: "Onboarding",
          })
        );
      }
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView style={RegisterStyle.container}>
      <View style={RegisterStyle.contents}>
        <Text style={RegisterStyle.title}>Let's get you set up!</Text>
        <View style={RegisterStyle.inputContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            autoCapitalize="none"
            style={RegisterStyle.input}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            style={RegisterStyle.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={RegisterStyle.input}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() => {
              setLoading(true);
              handleSignup();
            }}
            style={RegisterStyle.button}>
            {loading ? (
              <Image
                style={RegisterStyle.loading}
                source={require("../assets/images/loading.gif")}></Image>
            ) : (
              <Text style={RegisterStyle.buttonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
