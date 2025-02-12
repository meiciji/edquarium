import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from './Pages/Home';
import MathCourse from './Pages/Courses/MathCourse';
import ScienceCourse from './Pages/Courses/ScienceCourse';
import LanguageArtsCourse from './Pages/Courses/LanguageArtsCourse';
import HistoryCourse from './Pages/Courses/HistoryCourse';
import SnakeGame from './Minigames/SnakeGame';  // For math
import ScienceMatchingGame from './Minigames/ScienceMatchingGame';  // For science
import HistoryGame from './Minigames/ArtifactCollector';  // For history
import LanguageArtsGame from './Minigames/LanguageArtsGame';  // For language arts
import Chatbot from './Pages/Chatbot'; 
import { useState } from 'react';
import OnboardingScreen from './Pages/Onboarding';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen 
        name="Math" 
        component={MathCourse} 
      />
      <Stack.Screen 
        name="Science" 
        component={ScienceCourse} 
      />
      <Stack.Screen 
        name="LanguageArts" 
        component={LanguageArtsCourse} 
      />
      <Stack.Screen 
        name="History" 
        component={HistoryCourse} 
      />
      <Stack.Screen 
        name="Chatbot" 
        component={Chatbot} 
      />
      
      {/* Snake Game for Math */}
      <Stack.Screen
        name="MathGame"
        component={SnakeGame}
        initialParams={{ section: 'Addition'}}  // Pass the onPointsUpdate function for math
      />
      
      {/* Science Matching Game for Science */}
      <Stack.Screen
        name="ScienceMatchingGame"
        component={ScienceMatchingGame}
        initialParams={{ section: 'Biology' }}  // Pass the onPointsUpdate function for science
      />

      {/* History Game for History */}
      <Stack.Screen
        name="HistoryGame"
        component={HistoryGame}
      />

      {/* Language Arts Game for Language Arts */}
      <Stack.Screen
        name="LanguageArtsGame"
        component={LanguageArtsGame}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;