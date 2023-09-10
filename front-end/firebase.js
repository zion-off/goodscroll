// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
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
initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
