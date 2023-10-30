// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHzRMJaBaI_c0Ti00MdWFozMLDSjDqGf8",
  authDomain: "goodscroll-auth.firebaseapp.com",
  projectId: "goodscroll-auth",
  storageBucket: "goodscroll-auth.appspot.com",
  messagingSenderId: "536868038988",
  appId: "1:536868038988:web:f512700ca03ec397c447e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Firestore and get a reference to the service
const database = getFirestore(app);

export { auth, database };