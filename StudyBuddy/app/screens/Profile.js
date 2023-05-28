import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

import { colors } from "../../colors";

const Profile = () => {
  const navigation = useNavigation();

  const handleProfileEdit = () => {
    navigation.replace("Home");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.updateButton} onPress={handleProfileEdit}>
        <Text style={styles.updateText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.limeGreen,
    alignItems: "center",
  },
  pfp: {
    marginTop: 100,
    height: 200,
    width: 200,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: colors.brown,
    marginBottom: 50,
  },
  profile: {
    backgroundColor: colors.lightPink,
    flex: 1,
    width: "100%",
    borderRadius: 30,
  },
  profileHeader: {
    marginTop: 20,
    marginLeft: 25,
    fontSize: 30,
  },
  updateButton: {
    backgroundColor: colors.limeGreen,
    alignSelf: "center",
    marginTop: 20,
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    width: 150,
  },
  updateText: {
    color: "black",
    fontSize: 20,
    alignSelf: "center",
  },
});
