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

import TinderSwipe from "../../components/Card";

const Swipes = () => {
  const navigation = useNavigation();
  const handleHome = () => {
    navigation.replace("Home");
  };
  return (
    <View>
      <TinderSwipe />
      <TouchableOpacity onPress={handleHome} style={{ marginTop: 200 }}>
        <Text style={styles.searchText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Swipes;

const styles = StyleSheet.create({});
