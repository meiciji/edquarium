import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/images/octo.png')} style={styles.logo} />
      

      <Text style={styles.title}>Learn Through Play at EdQuest!</Text>
      <Text style={styles.subtitle}>
        Master new subjects through interactive games and engaging challenges
      </Text>

      <TouchableOpacity style={styles.button} onPress={onGetStarted}>
        <Text style={styles.buttonText}>Start Learning →</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Light blue for aquarium theme
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 75, // Circular logo
    borderWidth: 4,
    borderColor: '#2b7d7e', // Ocean green border for the logo
  },
  seaIconsTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  seaIconsBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  seaIcon: {
    fontSize: 30, // Larger size for better visibility
    marginHorizontal: 10, // Space between icons
    color: '#4c9d9e', // Ocean-inspired color for icons
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4c9d9e', // Ocean-inspired text color
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280', // Soft grey text
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4c9d9e', // Ocean-inspired button color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
