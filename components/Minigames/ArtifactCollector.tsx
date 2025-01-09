import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation types for your app
type RootStackParamList = {
  ArtifactCollector: {
    gameMode: "Ancient History" | "Medieval" | "Modern" | "WorldWars";
    setTotalPoints: React.Dispatch<React.SetStateAction<number>>;  // Add setTotalPoints here
  };
};

// Define props for ArtifactCollector
type ArtifactCollectorProps = {
  route: RouteProp<RootStackParamList, 'ArtifactCollector'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArtifactCollector'>;
};

const ArtifactCollector: React.FC<ArtifactCollectorProps> = ({ route, navigation }) => {
  const { gameMode } = route.params; // Retrieve the game mode from the params
  const [points, setPoints] = useState(0); // Points for current game session
  const [totalPoints, setTotalPoints] = useState(0); // Accumulated total points
  const [artifactIndex, setArtifactIndex] = useState(0);
  const [showError, setShowError] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [modes, setModes] = useState<any[]>([]); // Initialize as an empty array to avoid undefined errors
  const [artifact, setArtifact] = useState<string | null>(null); // State for storing artifact
  const [artifactImage, setArtifactImage] = useState<ImageSourcePropType>(); // State for storing the image (using ImageSourcePropType)
  const [loading, setLoading] = useState(true); // Add loading state
  const [gameOver, setGameOver] = useState(false); // State to track if the game is over

  // Artifact mapping based on the game mode
  const artifactMapping: Record<string, { name: string, image: ImageSourcePropType }> = {
    "Ancient History": {
      name: "Golden Ankh",
      image: require('../../assets/images/ankh.jpg'), // Local image path (adjust path accordingly)
    },
    "Medieval": {
      name: "Excalibur Sword",
      image: require('../../assets/images/sword.jpg'),
    },
    "Modern": {
      name: "Vintage Camera",
      image: require('../../assets/images/camera.jpeg'),
    },
    "WorldWars": {
      name: "WWII Soldier's Helmet",
      image: require('../../assets/images/helmet.jpg'),
    },
  };

  useEffect(() => {
    const loadGameData = () => {
      let gameData: any[] = [];

      switch (gameMode) {
        case "Ancient History":
          gameData = [
            {
              question: "What is the name of the ancient Egyptian tomb?",
              options: ["Pyramid", "Castle", "Temple"],
              correctAnswer: "Pyramid",
              story: "Correct! The pyramids were tombs for pharaohs and held treasures for the afterlife."
            },
            {
              question: "Who invented the telephone?",
              options: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla"],
              correctAnswer: "Alexander Graham Bell",
              story: "Correct! Alexander Graham Bell's invention revolutionized global communication."
            },
            {
              question: "What did the ancient Romans build for entertainment?",
              options: ["Aqueducts", "Colosseum", "Lighthouses"],
              correctAnswer: "Colosseum",
              story: "Correct! The Colosseum in Rome was used for gladiator fights and other spectacles."
            },
            {
              question: "Which ancient civilization built the Great Wall?",
              options: ["China", "Egypt", "Rome"],
              correctAnswer: "China",
              story: "Correct! The Great Wall of China was constructed to protect against invasions."
            },
            {
              question: "Who was the first emperor of China?",
              options: ["Qin Shi Huang", "Wudi", "Han Gaozu"],
              correctAnswer: "Qin Shi Huang",
              story: "Correct! Qin Shi Huang unified China and began the construction of the Great Wall."
            }
          ];
          break;
        case "Medieval":
          gameData = [
            {
              question: "Who was the famous knight of the Round Table?",
              options: ["Lancelot", "Arthur", "Merlin"],
              correctAnswer: "Lancelot",
              story: "Lancelot was one of King Arthur's most trusted knights, known for his bravery."
            },
            {
              question: "Which battle marked the end of the Hundred Years' War?",
              options: ["Battle of Agincourt", "Battle of Waterloo", "Battle of Hastings"],
              correctAnswer: "Battle of Agincourt",
              story: "The Battle of Agincourt in 1415 marked a turning point in the Hundred Years' War."
            },
            {
              question: "What was the name of the medieval fortress used to protect territories?",
              options: ["Castle", "Palace", "Fortress"],
              correctAnswer: "Castle",
              story: "Castles were fortresses used for defense and as royal residences."
            },
            {
              question: "Who wrote the famous play 'Romeo and Juliet'?",
              options: ["Shakespeare", "Dickens", "Hemingway"],
              correctAnswer: "Shakespeare",
              story: "William Shakespeare wrote 'Romeo and Juliet,' a timeless tragedy of love."
            }
          ];
          break;
        case "Modern":
          gameData = [
            {
              question: "Who invented the light bulb?",
              options: ["Thomas Edison", "Nikola Tesla", "Albert Einstein"],
              correctAnswer: "Thomas Edison",
              story: "Thomas Edison invented the practical light bulb, revolutionizing the world."
            },
            {
              question: "What year did the first man land on the moon?",
              options: ["1969", "1959", "1979"],
              correctAnswer: "1969",
              story: "In 1969, Neil Armstrong became the first human to walk on the moon."
            },
            {
              question: "Which company developed the first personal computer?",
              options: ["Apple", "IBM", "Microsoft"],
              correctAnswer: "Apple",
              story: "Apple introduced the first personal computer, changing technology forever."
            },
            {
              question: "Who developed the theory of relativity?",
              options: ["Isaac Newton", "Albert Einstein", "Galileo"],
              correctAnswer: "Albert Einstein",
              story: "Albert Einstein developed the theory of relativity, reshaping our understanding of physics."
            }
          ];
          break;
        case "WorldWars":
          gameData = [
            {
              question: "What event triggered the start of World War I?",
              options: ["Assassination of Archduke Ferdinand", "Invasion of Poland", "Pearl Harbor attack"],
              correctAnswer: "Assassination of Archduke Ferdinand",
              story: "The assassination of Archduke Ferdinand in 1914 triggered World War I."
            },
            {
              question: "Which country was not part of the Allies in World War II?",
              options: ["Germany", "France", "United States"],
              correctAnswer: "Germany",
              story: "Germany was part of the Axis Powers in World War II, opposing the Allies."
            },
            {
              question: "What was the name of the operation that led to the D-Day invasion?",
              options: ["Operation Barbarossa", "Operation Overlord", "Operation Valkyrie"],
              correctAnswer: "Operation Overlord",
              story: "Operation Overlord was the Allied invasion of Normandy during World War II."
            }
          ];
          break;
        default:
          console.error("Invalid game mode:", gameMode);
          break;
      }

      // Shuffle the options so the correct answer isn't always first
      gameData.forEach((item) => {
        item.options = item.options.sort(() => Math.random() - 0.5);
      });

      setModes(gameData);
      setLoading(false); // Stop loading once data is set
    };

    loadGameData();
  }, [gameMode]);
  const handleAnswer = (option: string) => {
    if (modes[artifactIndex] && option === modes[artifactIndex].correctAnswer) {
      setPoints((prevPoints) => prevPoints + 10);  // Add points for correct answer
      setShowStory(true);
      setTimeout(() => {
        setShowStory(false);
        if (artifactIndex < modes.length - 1) {
          setArtifactIndex(artifactIndex + 1);
        } else {
          // Set the winning artifact and its image
          const winningArtifact = artifactMapping[gameMode];
          setArtifact(winningArtifact.name);
          setArtifactImage(winningArtifact.image); // Set the artifact image
  
          handleGameOver();  // Call handleGameOver to update the total points
        }
      }, 2000); // Display the story for 2 seconds
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };
  
  const handleGameOver = () => {
    // Here we add the points to totalPoints at the end of the game
    setTotalPoints((prevTotal) => prevTotal + points); // Adds the earned points to total points
    setGameOver(true); // Set game over state
  };  
  

  const handleSaveAndExit = () => {
    // Save the points to totalPoints when exiting
    if (route.params.setTotalPoints) {
      route.params.setTotalPoints((prevTotal: number) => prevTotal + points);
    }
    navigation.goBack(); // Navigate back to the home screen or wherever you need
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gameMode} Artifact Collector</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text style={styles.points}>Points: {points}</Text>
          {gameOver ? (
            <View style={styles.finalScreen}>
              <Text style={styles.message}>Game Over! You've earned a {artifact}</Text>
              <Image source={artifactImage} style={styles.artifactImage} />
              <TouchableOpacity style={styles.button} onPress={handleSaveAndExit}>
                <Text style={styles.buttonText}>Save and Exit</Text>
              </TouchableOpacity>
              <Text style={styles.message}>Total Points: {totalPoints}</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.question}>{modes[artifactIndex].question}</Text>
              {modes[artifactIndex].options.map((option: string, index: number) => (
                <TouchableOpacity key={index} onPress={() => handleAnswer(option)}>
                  <Text style={styles.option}>{option}</Text>
                </TouchableOpacity>
              ))}
              {showStory && <Text style={styles.story}>{modes[artifactIndex].story}</Text>}
              {showError && <Text style={styles.error}>Wrong answer, try again!</Text>}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  points: {
    fontSize: 18,
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  option: {
    fontSize: 18,
    padding: 10,
    backgroundColor: "#d3d3d3",
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  story: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#007BFF",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  finalScreen: {
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  artifactImage: {
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 10,
  },
});

export default ArtifactCollector;