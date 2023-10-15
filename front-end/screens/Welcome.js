// dependencies
import { Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";
import React from "react";

// ui
import { WelcomeStyle } from "../styles/style";

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View style={WelcomeStyle.container}>
      <Text style={WelcomeStyle.title}>
        Something other than scrolling...
      </Text>
      <View style={WelcomeStyle.buttonContainer}>
        <TouchableOpacity
          style={WelcomeStyle.button}
          onPress={() => navigation.navigate("Login")}>
          <Text style={WelcomeStyle.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={WelcomeStyle.button}>
          <Text style={WelcomeStyle.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;
