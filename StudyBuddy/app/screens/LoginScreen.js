import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { React, useState, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, setDoc } from "@firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import * as Svg from "react-native-svg";

import Logo from "../../assets/icons/StudyPals.svg";
import { colors } from "../../colors";

// const auth = getAuth();

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Registered with:", user.email);
        setDoc(doc(db, "users", userCredential.user.uid), {
          profile: "false",
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "email-already-in-use") {
          alert("You already have an account with that email.");
        } else if (errorCode == "auth/invalid-email") {
          alert("Please provide a valid email");
        } else if (errorCode == "auth/weak-password") {
          alert("The password is too weak.");
        } else {
          alert(errorMessage);
        }
        // ..
      });
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("Logged in with:", user.email);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode == "auth/invalid-email") {
          alert("Please provide a valid email");
        } else if (errorCode == "auth/wrong-password") {
          alert("Wrong password. Please try again");
        } else if (errorCode == "auth/user-not-found") {
          alert("Username not recognised. Please try again");
        } else {
          alert(errorMessage);
        }
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Logo width={400} height={100} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="black"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="black"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.lightPink,
  },
  inputContainer: {
    marginTop: 40,
    width: "80%",
  },
  input: {
    backgroundColor: colors.beige,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: colors.darkBlue,
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: colors.limeGreen,
    marginTop: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});
