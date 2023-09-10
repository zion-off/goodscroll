import { StyleSheet } from "react-native";
import { colors } from "./variables";

export const WelcomeStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.yellowTwo,
    gap: 400,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 10,
  },
  button: {
    backgroundColor: colors.white,
    width: "100%",
    padding: 15,
    borderRadius: 10,
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
