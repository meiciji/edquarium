import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For persistent local storage
import { View, StyleSheet } from 'react-native';
import LandingPage from '../../components/Pages/Login'; // Landing page 
import AppNavigator from '../../components/navigator'; // Navigation system for the main app

export default function App() {
  //State to manage the current screen ('LandingPage' or 'AppNavigator')
  const [currentScreen, setCurrentScreen] = useState<'LandingPage' | 'AppNavigator'>('LandingPage');

  //Function to handle the "Start Learning" button action
  const handleGetStarted = async () => {
    //Default user data to be saved in AsyncStorage
    const newUser = { name: 'Learner', points: 0, streak: 0 };

    //Save the user data in local storage
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    
    //Update the state to transition to the AppNavigator (dashboard)
    setCurrentScreen('AppNavigator');
  };

  return (
    <View style={styles.container}>
      {/* Conditional rendering based on the current screen */}
      {currentScreen === 'LandingPage' ? (
        // Show LandingPage and pass the handleGetStarted function as a prop
        <LandingPage onGetStarted={handleGetStarted} />
      ) : (
        //Show the main app navigator (dashboard)
        <AppNavigator />
      )}
    </View>
  );
}

// Styles for the root container
const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container takes the full screen
  },
});