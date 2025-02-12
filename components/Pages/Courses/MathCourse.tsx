import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Define your navigation types
type RootStackParamList = {
  MathCourse: undefined;
  Chatbot: undefined;
  MathGame: { 
    gameMode: "addition" | "subtraction" | "multiplication" | "division"; 
    onPointsUpdate: (newPoints: number) => void; 
    onGameComplete: (section: string) => void;
    section: string;
  };
};

// Component for MathCourse
const MathCourse = () => {
  const [points, setPoints] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({
    addition: false,
    subtraction: false,
    multiplication: false,
    division: false,
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Load points and completed sections from AsyncStorage when the component mounts
useEffect(() => {
  // Define an asynchronous function to load the saved points
  const loadPoints = async () => {
    // Retrieve the value stored under the key "points" from AsyncStorage
    const savedPoints = await AsyncStorage.getItem("points");
    
    // Check if there is a saved value for points (it will return null if not set)
    if (savedPoints !== null) {
      // If savedPoints is not null, convert it to a number and set it in state
      setPoints(Number(savedPoints));
    }
  };

  // Define an asynchronous function to load the completed sections
  const loadCompletedSections = async () => {
    // Retrieve the value stored under the key "completedSections" from AsyncStorage
    const savedSections = await AsyncStorage.getItem("completedSections");
    
    // Check if there is a saved value for completed sections (it will return null if not set)
    if (savedSections !== null) {
      // If savedSections is not null, parse the JSON string into an array and set it in state
      setCompletedSections(JSON.parse(savedSections));
    }
  };

  // Call the functions to load the saved points/sections when the component mounts
  loadPoints();
  loadCompletedSections();

}, []);

  // Update points and save to AsyncStorage
  const handlePointsUpdate = async (newPoints: number) => {
    const updatedPoints = points + newPoints;
    setPoints(updatedPoints);
    await AsyncStorage.setItem("points", updatedPoints.toString());
  };

  // Mark section as complete and save to AsyncStorage
  const handleGameComplete = async (section: string) => {
    const updatedSections = { ...completedSections, [section]: true };
    setCompletedSections(updatedSections);
    await AsyncStorage.setItem("completedSections", JSON.stringify(updatedSections));
  };

  const calculateProgress = () => {
    const relevantSections = ["addition", "subtraction", "multiplication", "division"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../../assets/images/jellyfish.png')} style={styles.headerImage} />
      </View>

      {/* Points Display */}
      <View style={styles.pointsContainer}>
        <Text style={styles.title}>Deep Dive into Math!</Text>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>

      {/* Progress Bar Section */}
      <View style={styles.progressContainer}>
        <View style={styles.customProgressBar}>
          <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
        </View>
        <Text style={styles.progressText}>{calculateProgress()}% Complete</Text>
      </View>

      {/* Sections */}
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("MathGame", { 
              gameMode: "addition", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "addition"
            })
          }
        >
          <Ionicons
            name={completedSections.addition ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#388E3C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>1. Addition</Text>
            <Text style={styles.sectionDescription}>Learn about addition</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("MathGame", { 
              gameMode: "subtraction", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "subtraction"
            })
          }
        >
          <Ionicons
            name={completedSections.subtraction ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#0288D1"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>2. Subtraction</Text>
            <Text style={styles.sectionDescription}>Learn about subtraction</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("MathGame", { 
              gameMode: "multiplication", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "multiplication"
            })
          }
        >
          <Ionicons
            name={completedSections.multiplication ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#F57C00"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>3. Multiplication</Text>
            <Text style={styles.sectionDescription}>Learn about multiplication</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("MathGame", { 
              gameMode: "division", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "division"
            })
          }
        >
          <Ionicons
            name={completedSections.division ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#C2185B"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>4. Division</Text>
            <Text style={styles.sectionDescription}>Learn about division</Text>
          </View>
        </TouchableOpacity>

        {/* Button */}
                  {/* Button */}
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate("Chatbot")}
        >
          <Text style={styles.buttonText}>Have questions? Dr. Octo can help!</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Button */}
      <TouchableOpacity style={styles.footerButton}>
        <Text style={styles.footerButtonText}>Continue Learning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#def3f7",
  },
  header: {
    margin: 15,
    padding: 20,
    height: 200,
    width: 400,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically and horizontally
    backgroundColor: 'white',
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 10,
    shadowColor: '#BBDEFB', // Blue shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 1, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    overflow: 'hidden', // Ensures the image stays within the rounded corners
  },
  headerImage: {
    ...StyleSheet.absoluteFillObject, // Fills the entire header
    width: undefined, // Reset width for correct scaling
    height: undefined, // Reset height for correct scaling
    resizeMode: 'cover', // Ensures the image covers the space proportionally
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
    width: 370,
    height: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginVertical: 5,
    marginLeft: 10,
  },
  headerSubText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  progressContainer: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#BBDEFB",
    marginBottom: 15,
  },
  subText: {
    fontSize: 14,
    color: "#0288D1",
    marginBottom: 10,
  },
  customProgressBar: {
    width: "90%",
    height: 10,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0288D1",
  },
  progressText: {
    fontSize: 14,
    color: "#0288D1",
    marginTop: 5,
  },
  content: {
    padding: 10,
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0288D1",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#0288D1",
  },
  footerButton: {
    backgroundColor: "#0288D1",
    paddingVertical: 15,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0288D1',
    marginLeft: 20,
  },
  pointsContainer: {
    padding: 10,
    backgroundColor: "#BBDEFB",
    flexDirection: "row", // Ensures horizontal layout
    justifyContent: "space-between", // Pushes content to the right
  },
  pointsText: {
    fontSize: 14,
    color: "#0288D1",
    marginRight: 20,
  }  
});

export default MathCourse;