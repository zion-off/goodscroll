import React from 'react';
import { View, StyleSheet } from 'react-native';

const TallyMarks = ({ streak }) => {
  const groups = Math.floor(streak / 5);
  const remainder = streak % 5;

  const renderGroup = () => {
    const groupViews = [];
    for (let i = 0; i < 4; i++) {
      groupViews.push(<View key={`straight-${i}`} style={styles.straight} />);
    }
    groupViews.push(<View key="diagonal" style={styles.diagonal} />);
    return groupViews;
  };

  const renderRemaining = () => {
    const remainingViews = [];
    for (let i = 0; i < remainder; i++) {
      remainingViews.push(<View key={`remaining-${i}`} style={styles.straight} />);
    }
    return remainingViews;
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: groups }, (_, index) => (
        <View key={`group-${index}`} style={styles.group}>
          {renderGroup()}
        </View>
      ))}
      <View style={styles.group}>{renderRemaining()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 15,
    gap: 15,
    justifyContent: 'center',
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  straight: {
    width: 4,
    height: 30,
    backgroundColor: 'white',
  },
  diagonal: {
    position: 'absolute',
    width: 40,
    height: 4,
    backgroundColor: 'white',
    transform: [{ rotate: '-15deg' }],
    left: -6
  },
});

export default TallyMarks;