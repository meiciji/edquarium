import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Define your navigation types
type RootStackParamList = {
  ScienceCourse: undefined;
  ScienceMatchingGame: { 
    gameMode: "biology" | "astronomy" | "physicalScience" | "chemistry"; 
    onPointsUpdate: (newPoints: number) => void; 
    onGameComplete: (section: string) => void;
    section: string;
  };
};

// Component for ScienceCourse
const ScienceCourse = () => {
  const [points, setPoints] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({
    biology: false,
    astronomy: false,
    physicalScience: false,
    chemistry: false,
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Load points and completed sections from AsyncStorage when the component mounts
  useEffect(() => {
    const loadPoints = async () => {
      const savedPoints = await AsyncStorage.getItem("points");
      if (savedPoints !== null) {
        setPoints(Number(savedPoints));
      }
    };

    const loadCompletedSections = async () => {
      const savedSections = await AsyncStorage.getItem("completedSections");
      if (savedSections !== null) {
        setCompletedSections(JSON.parse(savedSections));
      }
    };

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
    const relevantSections = ["biology", "astronomy", "physicalScience", "chemistry"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    const progress = (completedCount / relevantSections.length) * 100;
    return progress;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
            <View style={styles.header}>
              <Image source={require('../../../assets/images/turtle.png')} style={styles.headerImage} />
            </View>
      
            {/* Points Display */}
            <View style={styles.pointsContainer}>
              <Text style={styles.title}>Science Lagoon!</Text>
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
            navigation.navigate("ScienceMatchingGame", { 
              gameMode: "biology", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "biology"
            })
          }
        >
          <Ionicons
            name={completedSections.biology ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#388E3C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>1. Biology Basics</Text>
            <Text style={styles.sectionDescription}>Learn about living organisms</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("ScienceMatchingGame", { 
              gameMode: "astronomy", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "astronomy"
            })
          }
        >
          <Ionicons
            name={completedSections.astronomy ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#388E3C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>2. Astronomy Exploration</Text>
            <Text style={styles.sectionDescription}>Explore the stars and planets</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("ScienceMatchingGame", { 
              gameMode: "physicalScience", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "physicalScience"
            })
          }
        >
          <Ionicons
            name={completedSections.physicalScience ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#388E3C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>3. Physical Science Fun</Text>
            <Text style={styles.sectionDescription}>Discover matter and energy</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("ScienceMatchingGame", { 
              gameMode: "chemistry", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "chemistry"
            })
          }
        >
          <Ionicons
            name={completedSections.chemistry ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#388E3C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>4. Chemistry Challenge</Text>
            <Text style={styles.sectionDescription}>Understand chemical reactions</Text>
          </View>
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
    backgroundColor: "#EDF9EB",
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
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 5,
  },
  headerSubText: {
    fontSize: 14,
    color: "#C8E6C9",
    textAlign: "center",
  },
  progressContainer: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#A5D6A7",
    marginBottom: 15,
  },
  subText: {
    fontSize: 14,
    color: "#388E3C",
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
    backgroundColor: "#388E3C",
  },
  progressText: {
    fontSize: 14,
    color: "#388E3C",
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
    color: "#388E3C",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#388E3C",
  },
  footerButton: {
    backgroundColor: "#388E3C",
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
    color: '#388E3C',
    marginLeft: 20,
  },
  pointsContainer: {
    padding: 10,
    backgroundColor: "#A5D6A7",
    flexDirection: "row", // Ensures horizontal layout
    justifyContent: "space-between", // Pushes content to the right
  },
  pointsText: {
    fontSize: 14,
    color: "#388E3C",
    marginRight: 20,
  }
}
);

export default ScienceCourse;