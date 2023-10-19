import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { CommonActions } from "@react-navigation/routers";

import { RegisterStyle } from "../styles/style";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // authentication function
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: ", user.email);
      })
      .catch((error) => alert(error.message));
  };

  // check for logged in state
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.dispatch(
          CommonActions.navigate({
            name: "Onboarding"
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
          <TouchableOpacity onPress={handleSignup} style={RegisterStyle.button}>
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
