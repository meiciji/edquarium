import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Image, TextInput, Platform, KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    backgroundColor: "#FDF6E3",
    title: "Welcome to EdQuarium!",
    description: "Please enter your name to get started.",
    image: require("../../assets/images/puffer.png"), // Replace with your image
    buttonText: "Next",
  },
  {
    id: 2,
    backgroundColor: "#FDEFEF",
    title: "Learn through play",
    description: "Explore courses in Math, Reading, Science, and History. Track your progress and earn achievements as you master new skills!",
    image: require("../../assets/images/crab.png"), // Replace with your image
    buttonText: "Next",
  },
  {
    id: 3,
    backgroundColor: "#EDF7F1",
    title: "Let's dive in!",
    description: "You can also ask our friendly AI chatbot for tips or share your journey on social media.",
    image: require("../../assets/images/stingray.png"), // Replace with your image
    buttonText: "Let's Start",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("");
  const scrollViewRef = React.useRef<KeyboardAwareScrollView>(null);

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: any; }; }; }) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(scrollPosition / width);
    setCurrentIndex(newIndex);
  };

  
  const handleNext = async () => {
    if (currentIndex === 0) {
      if (!name) {
        alert("Please enter your name.");
        return;
      }
      // Save the name in AsyncStorage
      await AsyncStorage.setItem('userName', name);
    }
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollToPosition(0, nextIndex * width, true);
    } else {
      onComplete();
    }
  };

  return (
    <KeyboardAwareScrollView
      ref={scrollViewRef}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <KeyboardAvoidingView
            key={item.id}
            style={[styles.slide, { backgroundColor: item.backgroundColor }]}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Image source={item.image} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            {index === 0 && (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>{item.buttonText}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        ))}
      </ScrollView>
      <View style={styles.indicatorContainer}>
        {onboardingData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.indicator,
              { opacity: currentIndex === index ? 1 : 0.5 },
            ]}
          />
        ))}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: "40%",
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
    margin: 15,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 110,
    width: "100%",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
    marginHorizontal: 5,
  },
});