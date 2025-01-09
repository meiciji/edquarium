import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the navigation types for your app
type RootStackParamList = {
  ScienceCourse: undefined;
  ScienceMatchingGame: {
    gameMode: "biology" | "astronomy" | "physicalScience" | "chemistry";
    onPointsUpdate: (newPoints: number) => void;
  };
};

// Define props for ScienceMatchingGame
type ScienceMatchingGameProps = {
  route: RouteProp<RootStackParamList, 'ScienceMatchingGame'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScienceMatchingGame'>;
};

const ScienceMatchingGame: React.FC<ScienceMatchingGameProps> = ({ route, navigation }) => {
  const { gameMode, onPointsUpdate } = route.params;
  const [matches, setMatches] = useState<boolean[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [cards, setCards] = useState<{ id: number; content: string; type: "term" | "definition"; termId: number }[]>([]);

  useEffect(() => {
    const loadGameData = () => {
      let terms: string[] = [];
      let definitions: string[] = [];
      switch (gameMode) {
        case "biology":
          terms = ["Cell", "Plant", "Animal", "DNA", "Nucleus", "Mitochondria"];
          definitions = [
            "Basic unit of life",
            "Organism that uses sunlight for photosynthesis",
            "Multicellular organism that consumes food for energy",
            "Molecule that carries genetic information",
            "Cell organelle that contains the DNA",
            "Powerhouse of the cell",
          ];
          break;
        case "astronomy":
          terms = ["Sun", "Moon", "Earth", "Star", "Galaxy", "Planet"];
          definitions = [
            "Star at the center of our solar system",
            "Natural satellite of the Earth",
            "Third planet from the Sun",
            "A luminous point in the night sky",
            "A system of stars, dust, and gas",
            "Celestial body that orbits a star",
          ];
          break;
        case "physicalScience":
          terms = ["Force", "Energy", "Matter", "Motion", "Velocity", "Gravity"];
          definitions = [
            "Push or pull on an object",
            "Ability to do work",
            "Substance that makes up everything",
            "Change in position of an object",
            "Speed in a specific direction",
            "Force that pulls objects toward the center of the Earth",
          ];
          break;
        case "chemistry":
          terms = ["Atom", "Molecule", "Element", "Compound", "Reaction", "Bond"];
          definitions = [
            "Smallest unit of an element",
            "Two or more atoms bonded together",
            "Substance made of one type of atom",
            "Substance made of two or more different elements",
            "Process where substances are transformed into new substances",
            "Force that holds atoms together in molecules",
          ];
          break;
      }

      let gameCards: { id: number; content: string; type: "term" | "definition"; termId: number }[] = [];

      terms.forEach((term, index) => {
        gameCards.push({ id: index * 2, content: term, type: "term", termId: index });
        gameCards.push({ id: index * 2 + 1, content: definitions[index], type: "definition", termId: index });
      });

      gameCards = shuffleArray(gameCards);
      setCards(gameCards);
      setMatches(new Array(gameCards.length).fill(false));
    };

    loadGameData();
  }, [gameMode]);

  const shuffleArray = (array: any[]) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || matches[index]) return;

    const updatedFlippedCards = [...flippedCards, index];
    setFlippedCards(updatedFlippedCards);

    if (updatedFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = updatedFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.termId === secondCard.termId) {
        const updatedMatches = [...matches];
        updatedMatches[firstIndex] = true;
        updatedMatches[secondIndex] = true;
        setMatches(updatedMatches);
        setPoints((prevPoints) => prevPoints + 10);

        if (updatedMatches.every((match) => match)) {
          Alert.alert(
            "You Won!",
            "Congratulations! Your points will be saved.",
            [
              {
                text: "Save and Exit",
                onPress: async () => {
                  await AsyncStorage.setItem("points", points.toString());
                  onPointsUpdate(points);
                  navigation.goBack();
                },
              },
            ]
          );
        }
      }

      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Matching Game - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => handleCardClick(index)}
            disabled={matches[index]}
          >
            <Text style={styles.cardText}>
              {flippedCards.includes(index) || matches[index] ? card.content : "?"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pointsContainer}>
        <Text style={styles.pointsText}>Points: {points}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#0288D1",
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    width: 120,
    height: 120,
    margin: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderColor: "#0288D1",
    borderWidth: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0288D1",
    textAlign: "center",
  },
  pointsContainer: {
    marginTop: 20,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0288D1",
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default ScienceMatchingGame;