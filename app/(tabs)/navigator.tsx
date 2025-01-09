import { createStackNavigator } from '@react-navigation/stack';
import Dashboard from '../Pages/Home';
import MathCourse from '../Pages/Courses/MathCourse';
import ScienceCourse from '../Pages/Courses/ScienceCourse';
import LanguageArtsCourse from '../Pages/Courses/LanguageArtsCourse';
import HistoryCourse from '../Pages/Courses/HistoryCourse';
import SnakeGame from '../../components/Minigames/SnakeGame';  // For math
import ScienceMatchingGame from '../../components/Minigames/ScienceMatchingGame';  // For science
import HistoryGame from '../../components/Minigames/ArtifactCollector';  // For history
import LanguageArtsGame from '../../components/Minigames/LanguageArtsGame';  // For language arts
import Chatbot from '../Pages/Chatbot';  // For language arts
import { useState } from 'react';

const Stack = createStackNavigator();

function AppNavigator() {
  const [mathPoints, setMathPoints] = useState(0);
  const [sciencePoints, setSciencePoints] = useState(0);
  const [languageArtsPoints, setLanguageArtsPoints] = useState(0);
  const [historyPoints, setHistoryPoints] = useState(0);

  const onMathPointsUpdate = (newPoints: number) => {
    setMathPoints(newPoints); // Update points for math
  };

  const onSciencePointsUpdate = (newPoints: number) => {
    setSciencePoints(newPoints); // Update points for science
  };

  const onLanguageArtsPointsUpdate = (newPoints: number) => {
    setLanguageArtsPoints(newPoints); // Update points for language arts
  };

  const onHistoryPointsUpdate = (newPoints: number) => {
    setHistoryPoints(newPoints); // Update points for history
  };

  return (
    <Stack.Navigator initialRouteName="Dashboard">
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen 
        name="Math" 
        component={MathCourse} 
        initialParams={{ points: mathPoints }}  // Pass math points to MathCourse
      />
      <Stack.Screen 
        name="Science" 
        component={ScienceCourse} 
        initialParams={{ points: sciencePoints }}  // Pass science points to ScienceCourse
      />
      <Stack.Screen 
        name="LanguageArts" 
        component={LanguageArtsCourse} 
        initialParams={{ points: languageArtsPoints }}  // Pass language arts points to LanguageArtsCourse
      />
      <Stack.Screen 
        name="History" 
        component={HistoryCourse} 
        initialParams={{ points: historyPoints }}  // Pass history points to HistoryCourse
      />
      <Stack.Screen 
        name="Chatbot" 
        component={Chatbot} 
      />
      
      {/* Snake Game for Math */}
      <Stack.Screen
        name="SnakeGame"
        component={SnakeGame}
        initialParams={{ section: 'Addition', onPointsUpdate: onMathPointsUpdate }}  // Pass the onPointsUpdate function for math
      />
      
      {/* Science Matching Game for Science */}
      <Stack.Screen
        name="ScienceMatchingGame"
        component={ScienceMatchingGame}
        initialParams={{ section: 'Biology', onPointsUpdate: onSciencePointsUpdate }}  // Pass the onPointsUpdate function for science
      />

      {/* History Game for History */}
      <Stack.Screen
        name="HistoryGame"
        component={HistoryGame}
        initialParams={{ onPointsUpdate: onHistoryPointsUpdate }}  // Pass the onPointsUpdate function for history
      />

      {/* Language Arts Game for Language Arts */}
      <Stack.Screen
        name="LanguageArtsGame"
        component={LanguageArtsGame}
        initialParams={{ onPointsUpdate: onLanguageArtsPointsUpdate }}  // Pass the onPointsUpdate function for language arts
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;