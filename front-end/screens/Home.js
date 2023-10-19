import React from "react";
import { useNavigation } from "@react-navigation/core";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Goodscroll!</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Onboarding")}>
        <Text>Navigate to onboarding page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
});

export default Home;
