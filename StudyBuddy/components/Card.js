import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  Image,
  Text,
} from "react-native";

const Card = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right
          Animated.spring(position, {
            toValue: { x: 500, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex(currentIndex + 1);
            position.setValue({ x: 0, y: 0 });
            // To signal acceptance (Replace log statement with function to link to firebase)
            console.log("ACCEPTED");
          });
        } else if (gesture.dx < -120) {
          // Swipe left
          Animated.spring(position, {
            toValue: { x: -500, y: gesture.dy },
            useNativeDriver: false,
          }).start(() => {
            setCurrentIndex(currentIndex + 1);
            position.setValue({ x: 0, y: 0 });
            // To signal rejection (Replace log statement with function to link to firebase)
            console.log("REJECTED");
          });
        } else {
          // Return to the original position
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  // Example profiles
  const data = [
    {
      id: "1",
      image: require("../assets/card_images/cardimg1.jpg"),
      name: "John Doe",
      age: 28,
    },
    {
      id: "2",
      image: require("../assets/card_images/cardimg2.jpeg"),
      name: "Jane Smith",
      age: 25,
    },
    {
      id: "2",
      image: require("../assets/card_images/cardimg2.jpeg"),
      name: "Jane Smith",
      age: 25,
    },
    {
      id: "2",
      image: require("../assets/card_images/cardimg2.jpeg"),
      name: "Jane Smith",
      age: 25,
    },
    {
      id: "2",
      image: require("../assets/card_images/cardimg2.jpeg"),
      name: "Jane Smith",
      age: 25,
    },
    {
      id: "2",
      image: require("../assets/card_images/cardimg2.jpeg"),
      name: "Jane Smith",
      age: 25,
    },
  ];

  const renderProfiles = () => {
    return data.map((profile, index) => {
      // I tried to display this when the cards have finished swiping but it does not work somehow
      // I think it is due to the useState for currentIndex not working properly when a card is swiped
      if (currentIndex >= data.length) {
        return (
          <View style-={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>NO MORE MATCHES</Text>
          </View>
        );
      } else if (index < currentIndex) {
        return null; // Skip profiles that have already been swiped
      } else if (index === currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={profile.id}
            style={[getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
          >
            <Image source={profile.image} style={styles.imageStyle} />
            <Text style={styles.nameStyle}>
              {profile.name}, {profile.age}
            </Text>
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={profile.id}
            style={[getCardStyle(), styles.cardStyle, { zIndex: -index }]}
          >
            <Image source={profile.image} style={styles.imageStyle} />
            <Text style={styles.nameStyle}>
              {profile.name}, {profile.age}
            </Text>
          </Animated.View>
        );
      }
    });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-250, 0, 250],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate: rotate },
      ],
    };
  };

  return <View style={styles.container}>{renderProfiles()}</View>;
};

export default Card;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardStyle: {
    position: "absolute",
    top: 70,
    width: 300,
    height: 400,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  imageStyle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  nameStyle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  noMatchesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noMatchesText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
