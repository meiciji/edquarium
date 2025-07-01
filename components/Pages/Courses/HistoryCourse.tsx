import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
  HistoryGame: { gameMode: "Ancient History" | "Medieval" | "Modern" | "World Wars"; onPointsUpdate: (newPoints: number) => void; onGameComplete: (section: string) => void };
};

const HistoryCourse = () => {
  const [points, setPoints] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<{ [key: string]: boolean }>({
    AncientHistory: false,
    Medieval: false,
    Modern: false,
    WorldWars: false,
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
    const relevantSections = ["AncientHistory", "Medieval", "Modern", "WorldWars"];
    const completedCount = relevantSections.filter(section => completedSections[section]).length;
    return (completedCount / relevantSections.length) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
          <View style={styles.header}>
            <Image source={require('../../../assets/images/fishstory.png')} style={styles.headerImage} />
          </View>
            
      {/* Points Display */}
         <View style={styles.pointsContainer}>
              <Text style={styles.title}>Fishy History</Text>
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
        {/* Section 1 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "Ancient History", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete,
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
            <Text style={styles.sectionDescription}>Discover the landmarks of the past!</Text>
          </View>
        </TouchableOpacity>

        {/* Section 2 */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("HistoryGame", { 
            gameMode: "Medieval", 
            onPointsUpdate: handlePointsUpdate,
            onGameComplete: handleGameComplete,
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
            <Text style={styles.sectionDescription}>Learn about innovations in our world!</Text>
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
    backgroundColor: "#eae3de",
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
    color: "#FFCDD2",
    textAlign: "center",
  },
  progressContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#cdbeb1",
  },
  subText: {
    fontSize: 14,
    color: "#816852",
    marginBottom: 10,
  },
  customProgressBar: {
    width: "90%",
    height: 10,
    backgroundColor: "#eae3de",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#816852",
  },
  progressText: {
    fontSize: 14,
    color: "#816852",
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
    color: "#816852",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#816852",
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#816852',
    marginLeft: 20,
  },
  pointsContainer: {
    padding: 10,
    backgroundColor: "#cdbeb1",
    flexDirection: "row", // Ensures horizontal layout
    justifyContent: "space-between", // Pushes content to the right
  },
  pointsText: {
    fontSize: 14,
    color: "#816852",
    marginRight: 20,
  }
});

export default HistoryCourse;