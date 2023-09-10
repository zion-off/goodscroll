import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from '@react-navigation/core';
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

import { LoginStyle } from "../styles/style";

const Login = () => {
  // state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // check for logged in state
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  // authentication functions
  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Registered with: ", user.email);
      })
      .catch((error) => alert(error.message));
  };
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then(
      (userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      }
    );
  };

  // Login page
  return (
    <KeyboardAvoidingView style={LoginStyle.container} behavior="padding">
      <View style={LoginStyle.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={LoginStyle.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={LoginStyle.input}
          secureTextEntry
        />
      </View>

      <View style={LoginStyle.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={LoginStyle.button}>
          <Text style={LoginStyle.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignup} style={LoginStyle.button}>
          <Text style={LoginStyle.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;