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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { CommonActions } from "@react-navigation/routers";

import { LoginStyle } from "../styles/style";

const Login = () => {
  // state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrect, setIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);

  // check for logged in state
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.dispatch(
          CommonActions.navigate({
            name: "NavBarPages",
            params: {
              screen: "Home",
            },
          })
        );
      }
    });
    return unsubscribe;
  }, []);

  // authentication function
  const handleLogin = () => {
    try {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Logged in with: ", user.email);
          setIncorrect(false);
          setLoading(false);
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            console.log("Invalid email format");
            setLoading(false);
            setIncorrect(true);
          } else {
            setLoading(false);
            console.log(error);
            setIncorrect(true);
          }
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
      setIncorrect(true);
    }
  };

  // Login page
  return (
    <KeyboardAvoidingView style={LoginStyle.container} behavior="padding">
      {incorrect && (
        <Text style={LoginStyle.incorrectText}>
          Incorrect email or password, try again!
        </Text>
      )}

      <View style={LoginStyle.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
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
        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            setIncorrect(false);
            handleLogin();
          }}
          style={LoginStyle.button}>
          {loading ? (
             <Image
             style={LoginStyle.loading}
             source={require("../assets/images/loading.gif")}></Image>
          ) : (
            <Text style={LoginStyle.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;
