import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import { colors, dimensions } from "./variables";

const customFonts = {
  SportingGrotesqueRegular: require("../assets/fonts/SportingGrotesque-Regular.otf"),
  SportingGrotesqueBold: require("../assets/fonts/SportingGrotesque-Bold.otf"),
};

const loadFonts = async () => {
  await Font.loadAsync(customFonts);
};

export { loadFonts };

export const WelcomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.yellowTwo,
    gap: 250,
  },
  title: {
    fontFamily: "SportingGrotesqueBold",
    textAlign: "left",
    width: "80%",
    fontSize: 35,
    lineHeight: 35 * 0.95,
    paddingTop: 35 * 0.95,
    color: colors.white,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    gap: dimensions.buttonSetGap,
  },
  button: {
    fontFamily: "SportingGrotesqueRegular",
    backgroundColor: colors.white,
    width: "100%",
    height: dimensions.buttonHeight,
    borderRadius: dimensions.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
});

export const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
    gap: 5,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },
  button: {
    backgroundColor: "yellow",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});

export const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  logoutButton: {
    backgroundColor: "yellow",
    width: "80%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
