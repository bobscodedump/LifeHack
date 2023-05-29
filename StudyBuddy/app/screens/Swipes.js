import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { React, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import Card from "../../components/Card";
import { colors } from "../../colors";
import { db, auth } from "../../firebase";

export default Swipes = () => {
  const [data, setData] = useState([]);
  const [personal, setPersonal] = useState({});
  const navigation = useNavigation();
  const handleHome = () => {
    navigation.replace("Home");
  };

  const leftSwipe = (cardIndex) => {
    console.log(cardIndex);
  };

  const rightSwipe = async (cardIndex) => {
    // console.log(cardIndex);
    const matchData = data[cardIndex];
    personalFormat = personal.username + "/" + personal.tele;
    matchFormat = matchData.username + "/" + matchData.tele;
    if (matchData.waitlist != "") {
      if (
        !matchData.matches.includes(personalFormat) &&
        matchData.waitlist.includes(personalFormat)
      ) {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          matches: personal.matches + matchFormat + "\\",
        });
        await updateDoc(doc(db, "users", matchData.id), {
          matches: matchFormat.matches + personalFormat + "\\",
        });
        alert("Match!");
      }
    }
    if (!personal.matches == "") {
      if (!personal.matches.includes(matchFormat)) {
        console.log("waitlist");
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          waitlist:
            personal.matches.replace("undefined", "") + matchFormat + "\\",
        });
      }
    } else {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        waitlist:
          personal.matches.replace("undefined", "") + matchFormat + "\\",
      });
    }

    // const currMatches = personal.matches;
    // const format = data[cardIndex].username + "/" + data[cardIndex].tele + "\\";
    // const personalFormat = personal.username + "/" + personal.tele;
    // let upload = "";
    // if (currMatches == "") {
    //   upload = format;
    // } else if (!currMatches.includes(format)) {
    //   upload = matches + format;
    //   await updateDoc(doc(db, "users", auth.currentUser.uid), {
    //     matches: upload,
    //   });
    // }

    // if (
    //   data[cardIndex].matches &&
    //   data[cardIndex].matches.includes(personalFormat)
    // ) {
    //   alert("Match!");
    // }
  };

  const getData = async () => {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);
    const d = docSnap.data();
    setPersonal(d);
    const q = query(
      collection(db, "users"),
      where("level", "==", d.level),
      where("username", "!=", d.username)
    );
    // const querySnapshot = await getDocs(q);
    // console.log("carddata");
    // querySnapshot.forEach((doc) => {
    //   setData([...data, doc.data()]);
    // });
    const test = onSnapshot(q, (snapshot) => {
      setData(
        snapshot.docs.map((doc) => {
          console.log(doc.data());
          return {
            id: doc.id,
            ...doc.data(),
          };
        })
      );
    });
  };

  useEffect(() => {
    getData();
    console.log(data);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}></View>
      <Text style={{ fontSize: 30, marginTop: 20 }}>
        Find Your Study Buddy!
      </Text>
      <Swiper
        containerStyle={{ backgroundColor: "transparent", marginTop: 70 }}
        cards={data}
        cardIndex={0}
        renderCard={(card) =>
          card ? (
            <View style={styles.card}>
              {card.image ? (
                <Image source={{ uri: card.image }} style={styles.pfp} />
              ) : (
                <Image
                  source={require("../../assets/images/emptyPic.png")}
                  style={styles.pfp}
                />
              )}

              <Text style={styles.username}>{card.username}</Text>
              <View style={styles.iconContainer}>
                <Image
                  source={require("../../assets/icons/school.png")}
                  style={styles.icon}
                />
                <Text style={styles.school}>{card.school}</Text>
              </View>
              <View style={styles.iconContainer2}>
                <Image
                  source={require("../../assets/icons/up.png")}
                  style={styles.icon}
                />
                <View style={styles.bubbleContainer}>
                  {card.strengths.split("\\").map(
                    (str) =>
                      str && (
                        <View style={styles.bubble}>
                          <Text>{str}</Text>
                        </View>
                      )
                  )}
                </View>
              </View>
              <View style={styles.iconContainer2}>
                <Image
                  source={require("../../assets/icons/down.png")}
                  style={styles.icon}
                />
                <View style={styles.bubbleContainer}>
                  {card.weaknesses.split("\\").map(
                    (wk) =>
                      wk && (
                        <View style={styles.bubble}>
                          <Text>{wk}</Text>
                        </View>
                      )
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.card, { justifyContent: "center" }]}>
              <Text style={{ alignSelf: "center", fontSize: 30 }}>
                {"No More Matches :("}
              </Text>
            </View>
          )
        }
        stackSize={3}
        verticalSwipe={false}
        overlayLabels={{
          left: {
            title: "SKIP",
            style: {
              label: {
                textAlign: "right",
                color: "red",
              },
            },
          },
          right: {
            title: "MATCH",
            style: {
              label: {
                textAlign: "left",
                color: "green",
              },
            },
          },
        }}
        onSwipedLeft={(cardIndex) => leftSwipe(cardIndex)}
        onSwipedRight={(cardIndex) => rightSwipe(cardIndex)}
      />
      <TouchableOpacity onPress={handleHome} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeButton: {
    backgroundColor: colors.brown,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "50%",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    top: 550,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
  },
  container: {
    backgroundColor: colors.lightPink,
    alignItems: "center",
  },
  card: {
    backgroundColor: colors.limeGreen,
    minHeight: "70%",
    borderRadius: 30,
    borderWidth: 4,
    alignItems: "center",
  },
  pfp: {
    marginTop: 20,
    height: 200,
    width: 200,
    borderRadius: 400,
    borderWidth: 2,
    borderColor: colors.brown,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    marginLeft: 11,
    alignSelf: "flex-start",
  },
  icon: {
    height: 25,
    width: 25,
    marginRight: 7,
  },
  school: {
    fontSize: 15,
    flexWrap: "wrap",
  },
  bubble: {
    borderRadius: 17,
    borderWidth: 1.5,
    padding: 5,
    borderColor: colors.darkBlue,
    backgroundColor: colors.beige,
    marginBottom: 3,
    marginRight: 3,
  },
  bubbleContainer: {
    flexWrap: "wrap",
    marginHorizontal: 10,
    flexDirection: "row",
    alignSelf: "flex-start",
  },
});
