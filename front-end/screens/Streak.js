import { View, Text, StyleSheet } from 'react-native';
import { auth, database } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import React, { useEffect } from 'react';

const Streak = () => {
  const currentUser = auth.currentUser;

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
    <View style={styles.container}>
      <Text style={styles.text}>Added to your streak!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Streak;
