import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the navigation types for your app
type RootStackParamList = {
  ScienceCourse: undefined;
  ScienceMatchingGame: {
    gameMode: "biology" | "astronomy" | "physicalScience" | "chemistry";
    onPointsUpdate: (newPoints: number) => void;
    onGameComplete: (section: string) => void;
    section: string;
  };
};

// Define props for ScienceMatchingGame
type ScienceMatchingGameProps = {
  route: RouteProp<RootStackParamList, 'ScienceMatchingGame'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ScienceMatchingGame'>;
};
const ScienceMatchingGame: React.FC<ScienceMatchingGameProps> = ({ route, navigation }) => {
  const { gameMode, onPointsUpdate, onGameComplete, section } = route.params;
  const [matches, setMatches] = useState<boolean[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [cards, setCards] = useState<{ id: number; content: string; type: "term" | "definition"; termId: number; image: string }[]>([]);
  const [cardColors, setCardColors] = useState<string[]>([]); // Store unique colors for each card
  const [showInstructions, setShowInstructions] = useState<boolean>(true); // State to control instruction screen visibility

  const InstructionScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
      return (
          <View style={styles.slide}>
            <Image
              source={require("../../assets/images/81.png")} // Replace with your actual image
              style={styles.image}
            />
            <Text style={styles.title}>Instructions</Text>
            <Text style={styles.description}>
            • Match the terms with their correct definitions.
            </Text>
            <Text style={styles.description}>
            • Flip two cards at a time to find matching pairs.
            </Text>
            <TouchableOpacity style={styles.button} onPress={onStartGame}>
              <Text style={styles.buttonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
      );
    };

  useEffect(() => {
    const loadGameData = () => {
      let terms: string[] = [];
      let definitions: string[] = [];
      let images: any[] = []; // Array to store image paths using require()
  
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
          images = [
            require("../../assets/images/cell.png"),
            require("../../assets/images/plant.png"),
            require("../../assets/images/animal.png"),
            require("../../assets/images/dna.png"),
            require("../../assets/images/nucleus.png"),
            require("../../assets/images/mitochondria.png"),
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
          images = [
            require("../../assets/images/sun.png"),
            require("../../assets/images/moon.png"),
            require("../../assets/images/earth.png"),
            require("../../assets/images/star.png"),
            require("../../assets/images/galaxy.png"),
            require("../../assets/images/planet.png"),
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
          images = [
            require("../../assets/images/force.png"),
            require("../../assets/images/energy.png"),
            require("../../assets/images/matter.png"),
            require("../../assets/images/motion.png"),
            require("../../assets/images/velocity.png"),
            require("../../assets/images/gravity.png"),
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
          images = [
            require("../../assets/images/atom.png"),
            require("../../assets/images/molecule.png"),
            require("../../assets/images/element.png"),
            require("../../assets/images/compound.png"),
            require("../../assets/images/reaction.png"),
            require("../../assets/images/bond.png"),
          ];
          break;
      }
  
      let gameCards: { id: number; content: string; type: "term" | "definition"; termId: number; image: any }[] = [];
  
      terms.forEach((term, index) => {
        gameCards.push({ id: index * 2, content: term, type: "term", termId: index, image: images[index] });
        gameCards.push({ id: index * 2 + 1, content: definitions[index], type: "definition", termId: index, image: images[index] });
      });
  
      gameCards = shuffleArray(gameCards);
      setCards(gameCards);
      setMatches(new Array(gameCards.length).fill(false));
  
      // Assign random pastel colors to each card
      setCardColors(generateRandomPastelColors(gameCards.length));
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

  const generateRandomPastelColors = (numColors: number) => {
    const pastelColors = [
      "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#D1BAFF", "#FFD1BA"
    ];
    let colors: string[] = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor = pastelColors[i % pastelColors.length]; // Ensure colors cycle if more cards than available colors
      colors.push(randomColor);
    }
    return colors;
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
                  onGameComplete(section); // Mark the section as complete
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

  const onStartGame = () => {
    setShowInstructions(false);
  };
  
  return (
    <View style={styles.container}>
      {showInstructions ? (
        <InstructionScreen onStartGame={onStartGame} />
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Matching Game - {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { borderColor: cardColors[index] }]} // Apply the unique color to each card
                onPress={() => handleCardClick(index)}
                disabled={matches[index]}
              >
                <Text style={styles.cardText}>
                  {flippedCards.includes(index) || matches[index] ? card.content : "?"}
                </Text>
                {(flippedCards.includes(index) || matches[index]) && card.type === "term" && (
                  <Image
                  source={typeof card.image === "string" ? { uri: card.image } : card.image}
                  style={styles.cardImage}
                />                
                )}

              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>Points: {points}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EDF9EB",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    backgroundColor: "#A5D6A7",
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    color: "#388E3C",
    fontWeight: "bold",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDF9EB", // Background color for the slide
    padding: 20,
    marginTop: 45,
  },
  image: {
    width: 300,
    height: 300,
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
    textAlign: "center",
    margin: 10,
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
    borderWidth: 2,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388E3C",
    textAlign: "center",
  },
  cardImage: {
    width: 50,
    height: 50,
    marginTop: 5,
  },
  pointsContainer: {
    marginTop: 20,
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#388E3C",
  },
  instructionScreen: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0288D1",
    marginBottom: 10,
  },
  detailedInstructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0288D1",
    marginBottom: 10,
  },
  instructionsList: {
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: 16,
    color: "#0288D1",
    marginBottom: 5,
  },
  startButton: {
    backgroundColor: "#0288D1",
    padding: 10,
    borderRadius: 5,
  },
  startText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default ScienceMatchingGame;