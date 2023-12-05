// ios client ID
// 1085053377250-ikuv6tn9p3g1riofsp5ov5ucpdg51mof.apps.googleusercontent.com

// dependencies
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import {
  NavigationContainer,
  useNavigationState,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";

// custom dependencies
import { loadFonts } from "./styles/style";

// screens
import Welcome from "./screens/Welcome";
import Register from "./screens/Register";
import Onboarding from "./screens/Onboarding";
import Instructions from "./screens/Instructions";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Timer from "./screens/Timer";
import Streak from "./screens/Streak";
import CalendarSelection from "./screens/CalendarSelection";

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const tabBarTheme = {
  colors: {
    secondaryContainer: "#6482B4",
    primaryContainer: "transparent",
  },
};

function NavBarPages({ navigation, route }) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  const getTabBarIconColor = (tabName) => {
    return tabName === routeName ? "white" : "#123C6E"; // Change colors as needed
  };

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <PaperProvider theme={tabBarTheme}>
      <Tab.Navigator
        labeled={false}
        shifting={true}
        barStyle={{
          position: "absolute",
          backgroundColor: "#6482B4",
          height: windowHeight * 0.1,
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="home"
                size={25}
                color={getTabBarIconColor("Home")}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="account"
                size={25}
                color={getTabBarIconColor("Profile")}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
}

export default function App() {
  // load fonts
  const [isFontLoaded, setIsFontLoaded] = useState(false);

  useEffect(() => {
    const loadCustomFont = async () => {
      await loadFonts();
      setIsFontLoaded(true);
    };
    loadCustomFont();
  }, []);

  // main component
  if (!isFontLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Register"
          component={Register}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Onboarding"
          component={Onboarding}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Instructions"
          component={Instructions}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Timer"
          component={Timer}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Streak"
          component={Streak}
        />
        <Stack.Screen options={{ headerShown: false }}
          name="CalendarSelection"
          component={CalendarSelection} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="NavBarPages"
          component={NavBarPages}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
