import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, ImageBackground, Alert } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect, DrawerActions } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For saving and retrieving data locally
import { LinearGradient } from 'expo-linear-gradient';

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
  const [userName, setUserName] = useState('');

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
    const fetchUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name !== null) {
          setUserName(name);
        }
      } catch (error) {
        console.error('Failed to load user name.', error);
      }
    };

    fetchUserName();
  }, []);

  // useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCompletedSections();
      loadPoints();
      loadAchievements();
    }, [])
  );
  

  const calculateMathProgress = () => {
    const relevantSections: (keyof CompletedSections)[] = ["addition", "subtraction", "multiplication", "division"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };
  
  const calculateScienceProgress = () => {
    const relevantSections: (keyof CompletedSections)[] = ["biology", "astronomy", "physicalScience", "chemistry"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };  

  // Function to calculate language arts progress based on completed sections
  const calculateLanguageArtsProgress = () => {
    const relevantSections: (keyof CompletedSections)[] = ["Storytelling", "Grammar", "Spelling", "Comprehension"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100; // Return percentage of completion
  };

  // Data for displaying courses with progress information
  const data = [
    { id: '1', title: 'Mathematics', progress: calculateMathProgress() / 100, source: require('../../assets/images/numbers.png'), courseLink: 'Math' },
    { id: '2', title: 'Science', progress: calculateScienceProgress() / 100, source: require('../../assets/images/biology.png'), courseLink: 'Science' },
    { id: '3', title: 'Reading', progress: calculateLanguageArtsProgress() / 100, source: require('../../assets/images/reading1.png'), courseLink: 'LanguageArts' },
    { id: '4', title: 'History', progress: 0, source: require('../../assets/images/globe1.png'), courseLink: 'History' },
  ];

  // Function to handle sharing achievements on social media
  const handleShare = async (platform: string) => {
    //A default message is set to advertise our app and the user's achievement.
    const message = 'I just earned 100 points on EdQuest, the ultimate educational app! 🎉 Join me on this learning adventure!';
    let url = '';

    // Set the URL depending on the selected platform to load the default messgae into the social media platofrm
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
  const handleCourseClick = (courseLink: any) => {
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
    <View style={{flex:1}}>
    <ImageBackground
      source={require('../../assets/images/underwater.png')}
      style={[styles.background]} // Ensure it takes up the full screen
    >
    <LinearGradient
  colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)']} // Lighter white with less opacity
    style={styles.gradientOverlay}
  />
  <ScrollView style={styles.container}>
  <View style={styles.container}>
      {/* Banner Section */}
      <View style={styles.bannerContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.bannerText}>Hello, {userName}!</Text>
        <Text style={styles.summarySubtitle}>Let's dive into learning!</Text>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
      <Image
        source={require('../../assets/images/1.png')} // Adjust the path to your mascot image
        style={styles.mascotImage}
      />
      </TouchableOpacity>
    </View>

      {/* Featured Categories Section */}
      <Text style={styles.featuredTitle}>Featured Lessons</Text>
      <View style={styles.categoriesContainer}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryItem}
            onPress={() => handleCourseClick(item.courseLink)} // Navigate to the course home page
          >
            <Image
              source={item.source} // Dynamically set icon source from data
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Results Section */}
      <View style={styles.recentResultsContainer}>
        <Text style={styles.recentResultsTitle}>Recent Progress</Text>
        <Text style={styles.seeAllText}>See all</Text>
        {data.map((item) => (
          <View style={[styles.resultCard, styles.shadowEffect]} key={item.id}>
            <View style={styles.resultDetails}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <View style={styles.resultProgress}>
                {/* Custom Progress Bar */}
                <View
                  style={[
                    styles.progressBar,
                    { width: `${item.progress * 100}%` },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.progressText}>
                {Math.round(item.progress * 100)}% Complete
              </Text>
          </View>
        ))}
      </View>

       {/* Summary Cards */}
       <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Points</Text>
          <Text style={styles.summaryValue}>{totalPoints}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Share on Social Media</Text>
          <View style={styles.socialIconsContainer}>
            <TouchableOpacity onPress={() => handleShare('facebook')}>
              <MaterialCommunityIcons name="facebook" size={32} color="#4267B2" style={styles.facebookIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare('twitter')}>
              
              <Image source={require('../../assets/images/xsocial.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
       {/* Your Achievements Gallery */}
    <View style={styles.achievementsContainer}>
      <Text style={styles.achievementsTitle}>Your Achievements</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {achievementsList.map((achievement, index) => (
          <View key={index} style={styles.achievementCard}>
            <Image source={require('../../assets/images/starfish.png')} style={styles.achievementImage} />
            <Text style={styles.achievementText}>{achievement}</Text>
          </View>
        ))}
      </ScrollView>
    </View>

    </View>
    </ScrollView>
    </ImageBackground>
    </View>
  );
}
  
  const styles = StyleSheet.create({
    background: {
      flex: 1, // Ensures the background covers the full screen
    },
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject, // Ensures the gradient covers the entire screen
    },
    container: {
      flex: 1,
      padding: 6,
      paddingBottom: 120,
    },
    recentResultsContainer: {
      margin: 12,
    },
    recentResultsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    seeAllText: {
      fontSize: 14,
      color: 'black',
      alignSelf: 'flex-end',
      marginBottom: 8,
    },
    resultCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      position: 'relative', // Ensure the card is positioned relative to its shadow layers
      },
      shadowEffect: {
            shadowColor: '#057785', // Red shadow
            shadowOffset: { width: 7, height: 7 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 5, // For Android shadow
            zIndex: 1, // Ensure the shadow is below the card
      },
      shadowEffect2: {
            shadowColor: '#F8C57C', // Green shadow
            shadowOffset: { width: -5, height: -5 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 5, // For Android shadow
            zIndex: 0, // Ensure the shadow is below the card
      },
    resultIndex: {
      backgroundColor: '#9C27B0',
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    resultIndexText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    resultDetails: {
      flex: 1,
    },
    textContainer: {
      flexDirection: 'column', // Stack text elements vertically
      alignItems: 'flex-start', // Align text to the left
    },
    resultTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
    },
    resultProgress: {
      backgroundColor: '#E0E0E0',
      height: 6,
      borderRadius: 3,
      marginTop: 4,
    },
    progressBar: {
      backgroundColor: '#6bbec6',
      height: 6,
      borderRadius: 3,
    },
    resultScore: {
      fontSize: 16,
      fontWeight: '600',
      color: '#555555',
    },
    bannerContainer: {
      margin: 5,
      padding: 20,
      alignItems: 'center',
      backgroundColor: 'white',
      position: 'relative',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: 10,
      shadowColor: '#6bbec6', // Blue shadow color
      shadowOffset: { width: 0, height: 2 }, // Shadow offset
      shadowOpacity: 1, // Shadow opacity
      shadowRadius: 4, // Shadow radius
    },
    bannerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
    },
    playButton: {
      marginTop: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    playButtonText: {
      fontSize: 16,
      color: '#9C27B0',
      fontWeight: 'bold',
    },
    featuredTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
      marginLeft: 16,
      marginTop: 10,
    },
    categoriesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    categoryItem: {
      alignItems: 'center',
      marginBottom: 16,
    },
    categoryIcon: {
      width: 70,
      height: 70,
      borderRadius: 30,
      backgroundColor: '#E0E0E0',
    },
    categoryText: {
      marginTop: 8,
      fontSize: 14,
      fontWeight: '600',
      color: '#555555',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    mascotImage: {
      width: 120,
      height: 120,
      marginRight: 15,
      alignSelf: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 5,
    },
    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      marginLeft: 3,
      marginRight: 3,
    },
    socialIconsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 16,
    },
    facebookIcon: {
      marginHorizontal: 10,
      marginLeft: 16,
      width: 40,
      height: 40,
    },
    socialIcon: {
      marginHorizontal: 10,
      width: 30,
      height: 30,
      marginTop: 2,
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      flex: 1,
      height: 120,
      marginHorizontal: 8,
      borderRadius: 12,
      padding: 14,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
    },
    cardIcon: {
      marginBottom: 8,
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
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
    },
    progressText: {
      fontSize: 14,
      color: '#111827',
    },
    achievementsContainer: {
      marginTop: 5,
      marginBottom: 20,
    },
    achievementsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      marginBottom: 10,
    },
    achievementImage: {
      width: 30,
      height: 30,
      borderRadius: 25,
      marginBottom: 10,
    },
    achievementCard: {
      backgroundColor: '#FFFFFF',
      marginHorizontal: 8,
      borderRadius: 12,
      height: 120,
      width: 200,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
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
      paddingVertical: 20,
      backgroundColor: '#f28d9f',
      borderRadius: 12,
      shadowColor: 'black', // Blue shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.5, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    },
    helpText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#FFFFFF',
      marginBottom: 10,
    },
    helpButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
    },
    helpButtonImage: {
      width: 32,
      height: 32,
      marginRight: 8,
    },
    helpButtonText: {
      fontSize: 16,
      color: '#111827',
      fontWeight: 'bold',
    },
  }); 