// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDriOArLjBt-0Yc0jevHLDk9UAp2OSXVX0",
  authDomain: "studybuddy-34be8.firebaseapp.com",
  projectId: "studybuddy-34be8",
  storageBucket: "studybuddy-34be8.appspot.com",
  messagingSenderId: "819617749247",
  appId: "1:819617749247:web:2f255be617ade8f50114ca",
  measurementId: "G-4C93FN57SH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
