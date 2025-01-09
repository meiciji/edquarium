import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icons}>
        <Text>📚</Text>
        <Text>🎮</Text>
      </View>
      <Text style={styles.title}>Learn Through Play</Text>
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
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});