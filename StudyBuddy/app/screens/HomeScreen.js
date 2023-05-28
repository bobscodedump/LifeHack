import { useNavigation } from "@react-navigation/core";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "@firebase/firestore";
import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";

import { auth, db } from "../../firebase";
import { colors } from "../../colors";

const HomeScreen = () => {
  const [profile, setProfile] = useState(false);

  const navigation = useNavigation();

  const haveProfile = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const p = await getDoc(docRef);
    setProfile(p);
  };

  useEffect(() => {
    haveProfile();
    // if (profile) {
    //   navigation.replace("Profile");
    // }
  }, []);

  const handleSearch = () => {
    navigation.replace("Swipes");
  };

  const handleProfileEdit = () => {
    navigation.replace("Profile");
  };

  const handleSignOut = () => {
    // auth
    //   .signOut()
    //   .then(() => {
    //     navigation.replace("Login");
    //   })
    //   .catch((error) => alert(error.message));
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.replace("Login");
        console.log("logged out");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/card_images/cardimg2.jpeg")}
        style={styles.pfp}
      />
      <Text style={styles.nameText}>Bob</Text>
      <ScrollView
        style={styles.profile}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <TouchableOpacity style={styles.newSearch} onPress={handleSearch}>
          <Text style={styles.searchText}>Start New Search!</Text>
        </TouchableOpacity>
        <Text style={styles.profileHeader}>Your Profile</Text>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/school.png")}
            style={styles.icon}
          />
          <Text style={styles.school}>National University of Singapore</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/tele.png")}
            style={styles.icon}
          />
          <Text style={styles.school}>@bobstele</Text>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/up.png")}
            style={styles.icon}
          />
          <Text style={styles.school}>Strengths:</Text>
        </View>
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/down.png")}
            style={styles.icon}
          />
          <Text style={styles.school}>Weaknesses:</Text>
        </View>
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
          <View style={styles.bubble}>
            <Text style={{ fontSize: 15 }}>Chemistry</Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Image
            source={require("../../assets/icons/saved.png")}
            style={styles.icon}
          />
          <Text style={styles.school}>Matched:</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: 100,
          }}
        >
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleProfileEdit}
          >
            <Text style={styles.updateText}>Update Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  //   container: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //   },
  updateButton: {
    backgroundColor: colors.limeGreen,
    alignSelf: "center",
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    height: 50,
    width: 150,
    marginRight: -18,
  },
  updateText: {
    color: "black",
    fontSize: 20,
    alignSelf: "center",
  },
  logoutButton: {
    backgroundColor: colors.darkBlue,
    alignSelf: "center",
    padding: 10,
    height: 50,
    width: 150,
    borderRadius: 25,
    borderWidth: 2,
    marginLeft: -18,
  },
  logoutText: {
    color: "white",
    fontSize: 20,
    alignSelf: "center",
  },
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
    marginBottom: 10,
  },
  profile: {
    backgroundColor: colors.lightPink,
    flex: 1,
    width: "100%",
    borderRadius: 30,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  profileHeader: {
    marginTop: 20,
    marginLeft: 25,
    fontSize: 30,
    marginBottom: 10,
  },
  nameText: { fontSize: 30, marginBottom: 15 },
  school: {
    fontSize: 20,
    flexWrap: "wrap",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 25,
    marginVertical: 20,
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  bubble: {
    borderRadius: 13,
    borderWidth: 1.5,
    padding: 3,
    borderColor: colors.darkBlue,
    backgroundColor: colors.beige,
    margin: 10,
  },
  bubbleContainer: {
    flexWrap: "wrap",
    marginHorizontal: 30,
    flexDirection: "row",
  },
  newSearch: {
    borderWidth: 2,
    backgroundColor: colors.beige,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 20,
    padding: 5,
  },
  searchText: {
    fontSize: 35,
  },
});
