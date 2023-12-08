import { View, Text, TouchableOpacity } from 'react-native';
import { auth, database } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { useEffect } from 'react';
import { useNavigation } from "@react-navigation/core";

import { StreakStyle } from '../styles/style';

const Streak = () => {
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const incrementStreak = async (userId) => {
      const userDocRef = doc(database, "streak", userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const currentStreak = docSnapshot.data().streak || 0; // Get current streak count or default to 0
        const incrementedStreak = currentStreak + 1;
        await setDoc(userDocRef, { streak: incrementedStreak }, { merge: true });
        console.log("Streak incremented by 1");
      } else {
        // If the document doesn't exist, create it with a streak of 1
        await setDoc(userDocRef, { streak: 1 });
        console.log("Streak initialized to 1");
      }
    };

    incrementStreak(currentUser.uid);
  }, []);
  return (
    <View style={StreakStyle.container}>
      <Text style={StreakStyle.text}>Added to your streak!</Text>
      <TouchableOpacity onPress={() => {navigation.navigate("Home")}} style={StreakStyle.button}>
        <Text style={StreakStyle.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Streak;
