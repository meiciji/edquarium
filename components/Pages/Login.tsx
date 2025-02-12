import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type LandingPageProps = {
  onGetStarted: () => void;
};

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [bubbleAnim] = useState(new Animated.Value(0)); 
  const [fishAnim] = useState(new Animated.Value(0));    

  // Function to animate the bubble
  const animateBubble = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bubbleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Function to animate the fish
  const animateFish = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fishAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fishAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateBubble();
    animateFish();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/images/underwater.png')} 
      style={styles.background}>
      <LinearGradient 
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']} 
        style={styles.gradientOverlay} 
      />
      <View style={styles.container}>
        {/* Single frosted glass container */}
        <View style={styles.frostedContainer}>
          {/* Logo */}
          <Image source={require('../../assets/images/octo.png')} style={styles.logo} />

          {/* Title */}
          <Text style={styles.title}>Learn Through Play at EdQuarium!</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Master new subjects through interactive games and engaging challenges
          </Text>

          {/* Button */}
          <TouchableOpacity style={styles.button} onPress={onGetStarted}>
            <Text style={styles.buttonText}>Start Learning →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated Bubble */}
      <Animated.Image
        source={require('../../assets/images/bubble.png')}
        style={[
          styles.bubble,
          {
            transform: [{ translateY: bubbleAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -20] }) }],
          },
        ]}
      />

      {/* Animated Fish */}
      <Animated.Image
        source={require('../../assets/images/clownfish.png')}
        style={[
          styles.fish,
          {
            transform: [{ translateY: fishAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }) }],
          },
        ]}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  frostedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 450,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: '#6bbec6',
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#5a645b',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#f28d9f',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  bubble: {
    position: 'absolute',
    bottom: 100,
    left: '5%',
    width: 100,
    height: 100,
  },
  fish: {
    position: 'absolute',
    bottom: 150,
    left: '70%',
    top: '12%',
    width: 100,
    height: 60,
  },
});
