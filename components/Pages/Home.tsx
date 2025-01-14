import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing vector icons from Expo
import AsyncStorage from '@react-native-async-storage/async-storage'; // For saving and retrieving data locally

// Type definition for completed sections in different subjects
type CompletedSections = {
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
  biology?: boolean;
  astronomy?: boolean;
  physicalScience?: boolean;
  chemistry?: boolean;
  Storytelling?: boolean;
  Grammar?: boolean;
  Spelling?: boolean;
  Comprehension?: boolean;
};

// Type definition for the navigation stack (available screens)
type RootStackParamList = {
  Chatbot: undefined;
  Math: undefined;
  Science: undefined;
  LanguageArts: undefined;
  History: undefined;
};

export default function Dashboard() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Hook to get the navigation object

  // State hooks to store data like achievements, points, and completed sections
  const [achievementsList, setAchievementsList] = useState<string[]>([]); // List of achievements
  const [totalPoints, setTotalPoints] = useState<number>(0); // User's total points
  const [completedSections, setCompletedSections] = useState<CompletedSections>({
    addition: false,
    subtraction: false,
    multiplication: false,
    division: false,
  });

  // Function to load the completed sections from AsyncStorage
  const loadCompletedSections = async () => {
    const savedSections = await AsyncStorage.getItem('completedSections');
    if (savedSections !== null) {
      setCompletedSections(JSON.parse(savedSections)); // Set the state with loaded data
    }
  };

  // Function to load the total points from AsyncStorage
  const loadPoints = async () => {
    const savedPoints = await AsyncStorage.getItem('points');
    if (savedPoints !== null) {
      setTotalPoints(Number(savedPoints)); // Set the state with loaded points
    }
  };

  // Function to load achievements from AsyncStorage
  const loadAchievements = async () => {
    try {
      const savedAchievements = await AsyncStorage.getItem("achievements");
      if (savedAchievements !== null) {
        setAchievementsList(JSON.parse(savedAchievements)); // Set achievements list
      }
    } catch (error) {
      console.error("Failed to load achievements", error); // Handle any errors during loading
    }
  };

  // useEffect to load the data when the component mounts
  useEffect(() => {
    loadCompletedSections();
    loadPoints();
    loadAchievements();
  }, []);

  // useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompletedSections();
      loadPoints();
      loadAchievements();
    }, [])
  );

  // Function to calculate math progress based on completed sections
  const calculateMathProgress = () => {
    const relevantSections = ["addition", "subtraction", "multiplication", "division"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };

  // Function to calculate science progress based on completed sections
  const calculateScienceProgress = () => {
    const relevantSections = ["biology", "astronomy", "physicalScience", "chemistry"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };

  // Function to calculate language arts progress based on completed sections
  const calculateLanguageArtsProgress = () => {
    const relevantSections = ["Storytelling", "Grammar", "Spelling", "Comprehension"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };

  // Data for displaying courses with progress information
  const data = [
    { id: '1', title: 'Mathematics', progress: calculateMathProgress() / 100, icon: '📘', courseLink: 'Math' },
    { id: '2', title: 'Science', progress: calculateScienceProgress() / 100, icon: '📗', courseLink: 'Science' },
    { id: '3', title: 'Language Arts', progress: calculateLanguageArtsProgress() / 100, icon: '📙', courseLink: 'LanguageArts' },
    { id: '4', title: 'History', progress: 0.50, icon: '📕', courseLink: 'History' },
  ];

  // Function to handle sharing achievements on social media
  const handleShare = async (platform: string) => {
    const message = 'I just earned 100 points on Edquest, the ultimate educational app! 🎉 Join me on this learning adventure!';
    let url = '';

    // Set the URL depending on the selected platform
    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    }

    if (url) {
      try {
        const supported = await Linking.canOpenURL(url); // Check if URL is supported by the device
        if (supported) {
          await Linking.openURL(url); // Open the URL if supported
        } else {
          console.error('Unsupported URL:', url); // Log if the URL is unsupported
        }
      } catch (error) {
        console.error('Error sharing:', error); // Log any errors encountered during sharing
      }
    }
  };

  // Function to handle course navigation
  const handleCourseClick = (courseLink: string) => {
    navigation.navigate(courseLink); // Navigate to the appropriate course screen
  };

  // Function to add a new achievement to the list and save to AsyncStorage
  const handleAddAchievement = async (newAchievement: string) => {
    // Check if the achievement already exists before adding it
    if (!achievementsList.includes(newAchievement)) {
      const updatedAchievements = [...achievementsList, newAchievement];
      setAchievementsList(updatedAchievements); // Update the state with the new list
      await AsyncStorage.setItem('achievements', JSON.stringify(updatedAchievements)); // Save to AsyncStorage
    }
  };

  // Function to update the user's points and save to AsyncStorage
  const handlePointsUpdate = async (newPoints: number) => {
    const updatedPoints = totalPoints + newPoints;
    setTotalPoints(updatedPoints); // Update the total points state
    await AsyncStorage.setItem('points', updatedPoints.toString()); // Save the updated points to AsyncStorage
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Dashboard</Text>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Points</Text>
          <Text style={styles.summaryValue}>{totalPoints}</Text>
          <Text style={styles.summarySubtitle}>+20 points from last session</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Share on Social Media</Text>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity onPress={() => handleShare('facebook')}>
              <MaterialCommunityIcons name="facebook" size={32} color="#4267B2" style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare('twitter')}>
              <MaterialCommunityIcons name="twitter" size={32} color="#1DA1F2" style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Progress Cards */}
      <View style={styles.progressContainer}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.progressCard}
            onPress={() => handleCourseClick(item.courseLink)}
          >
            <Text style={styles.cardTitle}>
              {item.icon} {item.title}
            </Text>
            {/* Custom Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${item.progress * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(item.progress * 100)}% Complete
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Your Achievements Gallery */}
      <View style={styles.achievementsContainer}>
        <Text style={styles.achievementsTitle}>Your Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {achievementsList.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Need Help Section */}
      <View style={styles.helpContainer}>
        <Text style={styles.helpText}>Need help with a subject?</Text>
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => navigation.navigate('Chatbot')} // Assuming you have a Chatbot screen
        >
          <Image 
            source={require('../../assets/images/octo.png')} // Add an image for the button
            style={styles.helpButtonImage}
          />
          <Text style={styles.helpButtonText}>Chat with Dr. Octo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    paddingBottom: 120, // Adjusted to give space for the navbar
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    flexBasis: '48%',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#c1d7d0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 14,
    color: 'black',
  },
  achievementsContainer: {
    marginTop: 20,
    marginBottom: 40, // Space before the navbar
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    borderRadius: 8,
    height: 100,
    width: 200,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  helpButtonImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  helpButtonText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});