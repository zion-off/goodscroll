import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import { colors, dimensions } from "./variables";

const customFonts = {
  SportingGrotesqueRegular: require("../assets/fonts/SportingGrotesque-Regular.otf"),
  SportingGrotesqueBold: require("../assets/fonts/SportingGrotesque-Bold.otf"),
  VioletSansRegular: require("../assets/fonts/VioletSans-Regular.otf"),
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

export const RegisterStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contents: {
    width: "80%",
    gap: 20,
  },
  title: {
    fontFamily: "SportingGrotesqueRegular",
    fontSize: 24,
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    backgroundColor: colors.grayOne,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    height: dimensions.buttonHeight,
  },
  button: {
    backgroundColor: colors.yellowTwo,
    borderRadius: dimensions.buttonRadius,
    height: dimensions.buttonHeight,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const OnboardingStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontFamily: "SportingGrotesqueRegular",
    fontSize: 20,
    width: "80%",
  },
  appContainer: {
    width: "80%",
    gap: 20,
  },
  app: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "left",
    width: "100%",
    gap: 30,
    backgroundColor: colors.grayOne,
    borderRadius: dimensions.buttonRadius,
    padding: 40,
  },
  appText: {
    fontFamily: "VioletSansRegular",
  },
  appIcon: {
    width: 30,
    height: 30,
    padding: 10,
  },
  selectedApp: {
    borderColor: colors.blueOne,
    borderWidth: 2,
    padding: 38,
  },
  proceedButton: {
    fontFamily: "SportingGrotesqueRegular",
    position: "absolute",
    bottom: 0,
    padding: 30,
    backgroundColor: colors.yellowTwo,
    width: "100%",
    alignItems: "center",
  },
});

export const InstructionsStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  instructions: {
    width: "80%",
    gap: 20,
  },
  text: {
    fontFamily: "VioletSansRegular",
  },
  image: {
    height: 200,
    resizeMode: "cover",
    aspectRatio: 810 / 687,
  },
  button: {
    fontFamily: "VioletSansRegular",
    position: "absolute",
    bottom: 0,
    padding: 30,
    backgroundColor: colors.yellowTwo,
    width: "100%",
    alignItems: "center",
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
    height: dimensions.buttonHeight,
    backgroundColor: colors.grayOne,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: dimensions.buttonRadius,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },
  button: {
    backgroundColor: colors.yellowTwo,
    width: "100%",
    padding: 15,
    borderRadius: dimensions.buttonRadius,
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
