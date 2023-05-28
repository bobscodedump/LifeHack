import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Stack } from "expo-router";

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

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
          <StackNav.Screen name="Home" component={HomeScreen} />
        </StackNav.Navigator>
      </NavigationContainer>
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
