// filepath: /Users/meiyingtham/Desktop/education-app/app/Pages/Home.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Expo vector icons

// Example achievements as text
const achievements = [
  'Completed 5 courses',
  'Achieved a 90% in Mathematics',
  'Science Expert Badge',
];

export default function Dashboard() {
  const navigation = useNavigation(); // Use hook to get navigation object

  const [achievementsList, setAchievements] = useState(achievements); // Start with the first set of achievements
  const [totalPoints, setTotalPoints] = useState(0); // Set initial points value

  const data = [
    { id: '1', title: 'Mathematics', progress: 0.65, icon: '📘', courseLink: 'Math' },
    { id: '2', title: 'Science', progress: 0.40, icon: '📗', courseLink: 'Science' },
    { id: '3', title: 'Language Arts', progress: 0.80, icon: '📙', courseLink: 'LanguageArts' },
    { id: '4', title: 'History', progress: 0.50, icon: '📕', courseLink: 'History' },
  ];

  const handleShare = async (platform) => {
    const message = 'I just earned 100 points on this educational app! 🎉';
    let url = '';

    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(message)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    }

    if (url) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.error('Unsupported URL:', url);
        }
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleCourseClick = (courseLink) => {
    // Navigate to the course screen within the app
    navigation.navigate(courseLink);
  };

  const handleAddAchievement = (newAchievement) => {
    // Add a new achievement to the list (to be triggered by some event)
    setAchievements([...achievementsList, newAchievement]);
  };

  const earnPointsFromMiniGame = (points) => {
    // Simulate earning points from mini-games
    setTotalPoints(totalPoints + points);
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
            source={require('../../assets/images/scholar.png')} // Add an image for the button
            style={styles.helpButtonImage}
          />
          <Text style={styles.helpButtonText}>Chat with Us</Text>
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
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
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
    width: 200, // Adjust width for text
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
    backgroundColor: '#10B981',
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
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});