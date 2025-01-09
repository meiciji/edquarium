import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  MathCourse: undefined;
  SnakeGame: { gameMode: "addition" | "subtraction" | "multiplication" | "division"; onPointsUpdate: (newPoints: number) => void };
};

const MathCourse = () => {
  const [points, setPoints] = useState<number>(0);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const loadPoints = async () => {
      const savedPoints = await AsyncStorage.getItem("points");
      if (savedPoints !== null) {
        setPoints(Number(savedPoints));
      }
    };
    loadPoints();
  }, []);

  const handlePointsUpdate = async (newPoints: number) => {
    const updatedPoints = points + newPoints;
    setPoints(updatedPoints);
    await AsyncStorage.setItem("points", updatedPoints.toString());
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="rocket-outline" size={40} color="#FFFFFF" />
        <Text style={styles.headerText}>Math Adventure</Text>
        <Text style={styles.headerSubText}>Swipe to guide your snake to victory!</Text>
      </View>

      {/* Points Display */}
      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>

      {/* Progress Bar Section */}
      <View style={styles.progressContainer}>
        <Text style={styles.subText}>Grade 3-4 · 4 Sections</Text>
        <View style={styles.customProgressBar}>
          <View style={[styles.progressFill, { width: `${points}%` }]} />
        </View>
        <Text style={styles.progressText}>{points}% Complete</Text>
      </View>

      {/* Sections */}
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("SnakeGame", { gameMode: "addition", onPointsUpdate: handlePointsUpdate })
          }
        >
          <Ionicons name="add-circle-outline" size={24} color="#4A148C" style={styles.icon} />
          <View>
            <Text style={styles.sectionTitle}>1. Addition Magic</Text>
            <Text style={styles.sectionDescription}>Master adding numbers</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("SnakeGame", { gameMode: "subtraction", onPointsUpdate: handlePointsUpdate })
          }
        >
          <Ionicons name="remove-circle-outline" size={24} color="#4A148C" style={styles.icon} />
          <View>
            <Text style={styles.sectionTitle}>2. Subtraction Fun</Text>
            <Text style={styles.sectionDescription}>Learn to subtract</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("SnakeGame", { gameMode: "multiplication", onPointsUpdate: handlePointsUpdate })
          }
        >
          <Ionicons name="close-circle-outline" size={24} color="#4A148C" style={styles.icon} />
          <View>
            <Text style={styles.sectionTitle}>3. Multiplication Mayhem</Text>
            <Text style={styles.sectionDescription}>Test your multiplication skills</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.section}
          onPress={() =>
            navigation.navigate("SnakeGame", { gameMode: "division", onPointsUpdate: handlePointsUpdate })
          }
        >
          <Ionicons name="pie-chart-outline" size={24} color="#4A148C" style={styles.icon} />
          <View>
            <Text style={styles.sectionTitle}>4. Division Quest</Text>
            <Text style={styles.sectionDescription}>Solve division puzzles</Text>
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
    backgroundColor: "#F3E5F5",
  },
  header: {
    backgroundColor: "#7B1FA2",
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
    color: "#EDE7F6",
    textAlign: "center",
  },
  progressContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#EDE7F6",
  },
  subText: {
    fontSize: 14,
    color: "#6A1B9A",
    marginBottom: 10,
  },
  customProgressBar: {
    width: "90%",
    height: 10,
    backgroundColor: "#D1C4E9",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#9C27B0",
  },
  progressText: {
    fontSize: 14,
    color: "#4A148C",
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
    color: "#4A148C",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#6A1B9A",
  },
  footerButton: {
    backgroundColor: "#7B1FA2",
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
    backgroundColor: "#D1C4E9",
    alignItems: "center",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4A148C",
  }
});

export default MathCourse;
