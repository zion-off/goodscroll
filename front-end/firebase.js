// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAHzRMJaBaI_c0Ti00MdWFozMLDSjDqGf8",
  authDomain: "goodscroll-auth.firebaseapp.com",
  projectId: "goodscroll-auth",
  storageBucket: "goodscroll-auth.appspot.com",
  messagingSenderId: "536868038988",
  appId: "1:536868038988:web:f512700ca03ec397c447e9",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const database = getFirestore(app);

export { auth, database };