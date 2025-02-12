import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  LanguageArtsCourse: undefined;
  LanguageArtsGame: { gameMode: "Storytelling" | "Grammar" | "Spelling" | "Comprehension"; onPointsUpdate: (newPoints: number) => void; onGameComplete: (section: string) => void };
};

const LanguageArtsCourse = () => {
  const [points, setPoints] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({
    Storytelling: false,
    Grammar: false,
    Spelling: false,
    Comprehension: false,
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const handlePointsUpdate = async (newPoints: number) => {
    const updatedPoints = points + newPoints;
    setPoints(updatedPoints);
    await AsyncStorage.setItem("points", updatedPoints.toString());
  };

  const handleGameComplete = async (section: string) => {
    const updatedSections = { ...completedSections, [section]: true };
    setCompletedSections(updatedSections);
    await AsyncStorage.setItem("completedSections", JSON.stringify(updatedSections));
  };

  const calculateProgress = () => {
    const relevantSections = ["Storytelling", "Grammar", "Spelling", "Comprehension"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
            <View style={styles.header}>
              <Image source={require('../../../assets/images/hermit.png')} style={styles.headerImage} />
            </View>
      
            {/* Points Display */}
            <View style={styles.pointsContainer}>
              <Text style={styles.title}>Reading Reef</Text>
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
            navigation.navigate("LanguageArtsGame", { 
              gameMode: "Storytelling", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "Storytelling"
            })
          }
        >
          <Ionicons
            name={completedSections.Storytelling ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#BF360C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>1. Storytelling Skills</Text>
            <Text style={styles.sectionDescription}>Learn to craft compelling stories</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("LanguageArtsGame", { 
              gameMode: "Grammar", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "Grammar"
            })
          }
        >
          <Ionicons
            name={completedSections.Grammar ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#BF360C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>2. Grammar Genius</Text>
            <Text style={styles.sectionDescription}>Master grammar rules</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("LanguageArtsGame", { 
              gameMode: "Spelling", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "Spelling"
            })
          }
        >
          <Ionicons
            name={completedSections.Spelling ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#BF360C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>3. Spelling Bee</Text>
            <Text style={styles.sectionDescription}>Explore spelling</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("LanguageArtsGame", { 
              gameMode: "Comprehension", 
              onPointsUpdate: handlePointsUpdate,
              onGameComplete: handleGameComplete,
              section: "Comprehension"
            })
          }
        >
          <Ionicons
            name={completedSections.Comprehension ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#BF360C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>4. Reading Comprehension</Text>
            <Text style={styles.sectionDescription}>Sharpen your understanding</Text>
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
    backgroundColor: "#fde9e4",
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
    color: "#FFCCBC",
    textAlign: "center",
  },
  progressContainer: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#FFCCBC",
    marginBottom: 15,
  },
  subText: {
    fontSize: 14,
    color: "#E64A19",
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
    backgroundColor: "#E64A19",
  },
  progressText: {
    fontSize: 14,
    color: "#BF360C",
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
    color: "#BF360C",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#E64A19",
  },
  footerButton: {
    backgroundColor: "#E64A19",
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
    color: '#BF360C',
    marginLeft: 20,
  },
  pointsContainer: {
    padding: 10,
    backgroundColor: "#FFCCBC",
    flexDirection: "row", // Ensures horizontal layout
    justifyContent: "space-between", // Pushes content to the right
  },
  pointsText: {
    fontSize: 14,
    color: "#BF360C",
    marginRight: 20,
  }
  
});

export default LanguageArtsCourse;