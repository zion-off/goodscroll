import { StyleSheet } from "react-native";
import * as Font from "expo-font";
import { colors, dimensions, text } from "./variables";

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
    gap: 300,
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
  buttonText: {
    fontFamily: "VioletSansRegular",
    fontSize: text.button,
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
    gap: dimensions.buttonSetGap,
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
  buttonText: {
    fontFamily: "VioletSansRegular",
  },
  loading: {
    height: dimensions.buttonHeight * 0.6,
    width: dimensions.buttonHeight * 0.6,
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
  incorrectText: {
    fontFamily: "VioletSansRegular",
    color: colors.red,
    paddingBottom: 40,
    textAlign: "left",
    width: "80%",
  },
  inputContainer: {
    width: "80%",
    gap: dimensions.buttonSetGap,
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
  },
  button: {
    height: dimensions.buttonHeight,
    backgroundColor: colors.yellowTwo,
    width: "100%",
    padding: 15,
    borderRadius: dimensions.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "VioletSansRegular",
    fontSize: text.button,
  },
  loading: {
    height: dimensions.buttonHeight * 0.6,
    width: dimensions.buttonHeight * 0.6,
  },
});

export const HomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "100%",
  },
  subContainer: {
    width: "90%",
    gap: 20,
  },
  appContainer: {
    width: "100%",
    backgroundColor: colors.grayOne,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
    flexWrap: 'wrap',
    borderRadius: 20,
    flexDirection: 'row',
  },
  appButton: {
    padding: 10,
    marginBottom: 5,
  },
  appIcon: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
});

export const ProfileStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  changeEmailButton: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButton: {
    backgroundColor: "red",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
