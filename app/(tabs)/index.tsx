import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from 'react-native';
import LandingPage from '../Pages/Login'; // Ensure this path is correct
import AppNavigator from '../(tabs)/navigator'; // Import AppNavigator (which already includes NavigationContainer)

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'LandingPage' | 'AppNavigator'>('LandingPage');

  const handleGetStarted = async () => {
    // Create and save default user data when "Start Learning" is pressed
    const newUser = { name: 'Learner', points: 0, streak: 0 };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    
    // Now navigate to the app's main dashboard
    setCurrentScreen('AppNavigator'); // Transition to the dashboard
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'LandingPage' ? (
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        <AppNavigator /> // After "Start Learning", switch to AppNavigator (Dashboard)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
