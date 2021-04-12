import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';
import { colors } from './src/utils/colors';
import { spacing } from './src/utils/sizes';

const STATUSES = {
  COMPLETE: 1,
  CANCELLED: 2,
};
export default function App() {
  const [focusSubject, setFocusSubject] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);

  const addFocusHistorySubjectWithStatus = (subject, status) => {
    setFocusHistory([...focusHistory, { key: String(focusHistory.length + 1), subject, status }]);
  };

  const onTimerEnd = () => {
    addFocusHistorySubjectWithStatus(focusSubject, STATUSES.COMPLETE);
    setFocusSubject(null);
  };

  const clearSubject = () => {
    addFocusHistorySubjectWithStatus(focusSubject, STATUSES.CANCELLED);
    setFocusSubject(null);
  };

  //load focus history from async storage
  useEffect(() => {
    const loadFocusHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('focusHistory');
        if (history && JSON.parse(history).length) {
          setFocusHistory(JSON.parse(history));
        }
      } catch (e) {
        console.log(e);
      }
    };

    // console.log('lets run load focus history');
    loadFocusHistory();
  }, []);

  const onClearHistory = () => {
    setFocusHistory([]);
  };

  //save focus history
  useEffect(() => {
    const saveFocusHistory = async () => {
      try {
        await AsyncStorage.setItem(
          'focusHistory',
          JSON.stringify(focusHistory)
        );
      } catch (e) {
        console.log(e);
      }
    };

    // console.log('lets run saveFocusHistory');
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={onTimerEnd}
          clearSubject={clearSubject}
        />
      ) : (
        <View style={{flex: 1}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClearHistory} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.lg,
    backgroundColor: colors.mainBackground,
  },
});
