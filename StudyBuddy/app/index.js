import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Stack } from "expo-router";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import Swipes from "./screens/Swipes";
import Profile from "./screens/Profile";

const StackNav = createNativeStackNavigator();

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <NavigationContainer independent={true}>
        <StackNav.Navigator>
          <StackNav.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <StackNav.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <StackNav.Screen
            name="Profile"
            component={Profile}
            options={{ headerShown: false }}
          />
          <StackNav.Screen
            name="Swipes"
            component={Swipes}
            options={{ headerShown: false }}
          />
        </StackNav.Navigator>
      </NavigationContainer>
      {/* <SafeAreaView>
        <Swipes />
      </SafeAreaView> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
