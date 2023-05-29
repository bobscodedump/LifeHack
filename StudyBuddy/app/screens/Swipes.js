import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";

import Card from "../../components/Card";
import { colors } from "../../colors";

const Swipes = () => {
  const navigation = useNavigation();
  const handleHome = () => {
    navigation.replace("Home");
  };
  return (
    <View>
      <Card/>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Swipes;

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: colors.brown,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '50%',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    top: 550
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
  }
});
