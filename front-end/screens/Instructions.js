import React from "react";
import { useNavigation } from "@react-navigation/core";
import { View, Text, Image, TouchableOpacity } from "react-native";

import { InstructionsStyle } from "../styles/style";

const Instructions = () => {
  const navigation = useNavigation();

  return (
    <View style={InstructionsStyle.container}>
      <View style={InstructionsStyle.instructions}>
        <Text style={InstructionsStyle.text}>
          1. Remove the selected apps from your home screen.
        </Text>
        <Image
          style={InstructionsStyle.image}
          source={require("../assets/images/remove-app-dialog.png")}></Image>
        <Text style={InstructionsStyle.text}>
          2. These apps will show up on your Goodscroll home. Next time you want
          to use the app, launch it from Goodscroll.
        </Text>
        <Text style={InstructionsStyle.text}>
          3. The added friction between you and distracting apps can help you
          cut down their use.
        </Text>
        <Text style={InstructionsStyle.text}>
          4. Plus, this allows Goodscroll to send you helpful reminders about
          your usage patterns and goals!
        </Text>
      </View>
      <TouchableOpacity
        style={InstructionsStyle.button}
        onPress={() =>
          navigation.navigate("NavBarPages", {
            screen: "Home",
          })
        }>
        <Text style={InstructionsStyle.buttonText}>Finish!</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Instructions;
