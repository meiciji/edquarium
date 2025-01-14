import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  HistoryGame: { gameMode: "Ancient History" | "Medieval" | "Modern" | "World Wars"; onPointsUpdate: (newPoints: number) => void; onGameComplete: (section: string) => void };
};

const HistoryCourse = () => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({
    AncientHistory: false,
    Medieval: false,
    Modern: false,
    WorldWars: false,
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadPoints = async () => {
      try {
        const savedPoints = await AsyncStorage.getItem("artifactPoints");
        if (savedPoints) {
          setTotalPoints(parseInt(savedPoints, 10));
        }
      } catch (error) {
        console.error("Failed to load points", error);
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
    const updatedPoints = totalPoints + newPoints;
    setTotalPoints(updatedPoints);
    await AsyncStorage.setItem("artifactPoints", updatedPoints.toString());
  };

  const handleGameComplete = async (section: string) => {
    const updatedSections = { ...completedSections, [section]: true };
    setCompletedSections(updatedSections);
    await AsyncStorage.setItem("completedSections", JSON.stringify(updatedSections));
  };

  const calculateProgress = () => {
    const relevantSections = ["AncientHistory", "Medieval", "Modern", "WorldWars"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="book-outline" size={40} color="#FFFFFF" />
        <Text style={styles.headerText}>History Journey</Text>
        <Text style={styles.headerSubText}>Explore the past to shape the future!</Text>
      </View>

      {/* Points Display */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Total Points: {totalPoints}</Text>
      </View>

      {/* Progress Bar Section */}
      <View style={styles.progressContainer}>
        <Text style={styles.subText}>Grade 3-4 · 4 Sections</Text>
        <View style={styles.customProgressBar}>
          <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
        </View>
        <Text style={styles.progressText}>{calculateProgress()}% Complete</Text>
      </View>

      {/* Sections */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Section 1 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "Ancient History", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete,
            section: "AncientHistory"
          })}
        >
          <Ionicons
            name={completedSections.AncientHistory ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#4A148C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>1. Ancient Times Adventure</Text>
            <Text style={styles.sectionDescription}>Discover the pyramids and castles of the past!</Text>
          </View>
        </TouchableOpacity>

        {/* Section 2 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "Medieval", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete,
            section: "Medieval"
          })}
        >
          <Ionicons
            name={completedSections.Medieval ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#4A148C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>2. Medieval Quest</Text>
            <Text style={styles.sectionDescription}>Travel through castles and medieval lands!</Text>
          </View>
        </TouchableOpacity>

        {/* Section 3 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "Modern", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete,
            section: "Modern"
          })}
        >
          <Ionicons
            name={completedSections.Modern ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#4A148C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>3. Modern Era Discoveries</Text>
            <Text style={styles.sectionDescription}>Learn about innovations that shaped our world!</Text>
          </View>
        </TouchableOpacity>

        {/* Section 4 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "World Wars", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete
          })}
        >
          <Ionicons
            name={completedSections.WorldWars ? "checkmark-circle-outline" : "ellipse-outline"}
            size={24}
            color="#4A148C"
            style={styles.icon}
          />
          <View>
            <Text style={styles.sectionTitle}>4. World Wars</Text>
            <Text style={styles.sectionDescription}>Explore the wars that changed history!</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#D32F2F",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 5,
  },
  headerSubText: {
    fontSize: 14,
    color: "#FFCDD2",
    textAlign: "center",
  },
  progressContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  subText: {
    fontSize: 14,
    color: "#B71C1C",
    marginBottom: 10,
  },
  customProgressBar: {
    width: "90%",
    height: 10,
    backgroundColor: "#FF8A80",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#D32F2F",
  },
  progressText: {
    fontSize: 14,
    color: "#B71C1C",
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
    color: "#D32F2F",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#B71C1C",
  },
  footerButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    alignItems: "center",
  },
  footerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  pointsContainer: {
    padding: 10,
    backgroundColor: "#FFCDD2",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D32F2F",
  },
});

export default HistoryCourse;