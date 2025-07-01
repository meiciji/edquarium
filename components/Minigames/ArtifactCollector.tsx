import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, ImageBackground } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the navigation types for your app
type RootStackParamList = {
  ArtifactCollector: {
    gameMode: "Ancient History" | "Medieval" | "Modern" | "World Wars";
    setTotalPoints: React.Dispatch<React.SetStateAction<number>>;  // Add setTotalPoints here
    onGameComplete: (section: string) => void; // Add onGameComplete here
  };
};

// Define props for ArtifactCollector
type ArtifactCollectorProps = {
  route: RouteProp<RootStackParamList, 'ArtifactCollector'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'ArtifactCollector'>;
};

const ArtifactCollector: React.FC<ArtifactCollectorProps> = ({ route, navigation }) => {
  const { gameMode, onGameComplete } = route.params; 
  const [points, setPoints] = useState(0); 
  const [artifactIndex, setArtifactIndex] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0); 
  const [showError, setShowError] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [modes, setModes] = useState<any[]>([]); 
  const [artifact, setArtifact] = useState<string | null>(null); 
  const [artifactImage, setArtifactImage] = useState<ImageSourcePropType>(); 
  const [loading, setLoading] = useState(true); 
  const [gameOver, setGameOver] = useState(false); 
  const [showInstructions, setShowInstructions] = useState(true); 

  // Artifact mapping based on the game mode
  const artifactMapping: Record<string, { name: string, image: ImageSourcePropType }> = {
    "Ancient History": {
      name: "Golden Ankh",
      image: require('../../assets/images/ankh.jpg'), 
    },
    "Medieval": {
      name: "Excalibur Sword",
      image: require('../../assets/images/sword.jpg'),
    },
    "Modern": {
      name: "Vintage Camera",
      image: require('../../assets/images/camera.jpeg'),
    },
    "World Wars": {
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
              story: "Correct! Lancelot was one of King Arthur's most trusted knights, known for his bravery."
            },
            {
              question: "Which battle marked the end of the Hundred Years' War?",
              options: ["Battle of Agincourt", "Battle of Waterloo", "Battle of Hastings"],
              correctAnswer: "Battle of Agincourt",
              story: "Correct! The Battle of Agincourt in 1415 marked a turning point in the Hundred Years' War."
            },
            {
              question: "What was the name of the medieval fortress used to protect territories?",
              options: ["Castle", "Palace", "Fortress"],
              correctAnswer: "Castle",
              story: "Correct! Castles were fortresses used for defense and as royal residences."
            },
            {
              question: "Who wrote the famous play 'Romeo and Juliet'?",
              options: ["Shakespeare", "Dickens", "Hemingway"],
              correctAnswer: "Shakespeare",
              story: "Correct! William Shakespeare wrote 'Romeo and Juliet,' a timeless tragedy of love."
            }
          ];
          break;
        case "Modern":
          gameData = [
            {
              question: "Who invented the light bulb?",
              options: ["Thomas Edison", "Nikola Tesla", "Albert Einstein"],
              correctAnswer: "Thomas Edison",
              story: "Correct! Thomas Edison invented the practical light bulb, revolutionizing the world."
            },
            {
              question: "What year did the first man land on the moon?",
              options: ["1969", "1959", "1979"],
              correctAnswer: "1969",
              story: "Correct! In 1969, Neil Armstrong became the first human to walk on the moon."
            },
            {
              question: "Which company developed the first personal computer?",
              options: ["Apple", "IBM", "Microsoft"],
              correctAnswer: "Apple",
              story: "Correct! Apple introduced the first personal computer, changing technology forever."
            },
            {
              question: "Who developed the theory of relativity?",
              options: ["Isaac Newton", "Albert Einstein", "Galileo"],
              correctAnswer: "Albert Einstein",
              story: "Correct! Albert Einstein developed the theory of relativity, reshaping our understanding of physics."
            }
          ];
          break;
        case "World Wars":
          gameData = [
            {
              question: "What started World War I?",
              options: ["The shooting of Archduke Ferdinand", "The attack on Pearl Harbor", "The invasion of Poland"],
              correctAnswer: "The shooting of Archduke Ferdinand",
              story: "Correct! The shooting of Archduke Ferdinand in 1914 caused World War I to start."
            },
            {
              question: "Which country was on the side of the Axis powers in World War II?",
              options: ["Germany", "France", "United States"],
              correctAnswer: "Germany",
              story: "Correct! Germany was part of the Axis powers alongside Italy and Japan, fighting against the Allies in World War II."
            },
            {
              question: "What was the big mission that took place on D-Day in World War II?",
              options: ["Operation Overlord", "Operation Victory", "Operation Freedom"],
              correctAnswer: "Operation Overlord",
              story: "Correct! Operation Overlord was the mission where the Allies landed in Normandy to fight the enemy in World War II."
            },
            {
              question: "Which event caused the United States to join World War II?",
              options: ["The attack on Pearl Harbor", "The Battle of Britain", "The sinking of the Lusitania"],
              correctAnswer: "The attack on Pearl Harbor",
              story: "Correct! The attack on Pearl Harbor in 1941 made the United States join World War II."
            },
            {
              question: "Who was the leader of Germany during World War II?",
              options: ["Adolf Hitler", "Winston Churchill", "Franklin D. Roosevelt"],
              correctAnswer: "Adolf Hitler",
              story: "Correct! Adolf Hitler was the leader of Germany during World War II and led the country in the war against the Allies."
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
      setLoading(false);
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
    onGameComplete(gameMode); // Mark the section as complete
    navigation.goBack(); // Navigate back to the home screen or wherever you need
  };

  const onStartGame = () => {
    setShowInstructions(false);
  };

  const InstructionScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
        return (
            <View style={styles.slide}>
              <Image
                source={require("../../assets/images/nemo.png")} // Replace with your actual image
                style={styles.image}
              />
              <Text style={styles.instructionsTitle}>Instructions</Text>
              <Text style={styles.description}>
              • Answer questions and earn points to collect achievements.
              </Text>
              <Text style={styles.description}>
              • Each correct answer leads to a story about ancient history!
              </Text>
              <TouchableOpacity style={styles.instructionsButton} onPress={onStartGame}>
                <Text style={styles.instructionsButtonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
        );
      };

  return (
    <>
      {showInstructions ? (
        <View style={styles.container}>
          <InstructionScreen onStartGame={onStartGame} />
        </View>
      ) : (
        <ImageBackground
          source={require('../../assets/images/historical.jpg')} 
          style={styles.background}
        >
          <View style={styles.container}>
            <Text style={styles.title}>{gameMode} Quiz</Text>
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
        </ImageBackground>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", 
    padding: 20,
    marginTop: 45,
    width: "100%",
    height: "100%"
  },
  image: {
    width: 400,
    height: 200,
    marginBottom: 20,
  },
  instructionsTitle: {
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
  instructionsButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 40
  },
  instructionsButtonText: {
    color: "#FFF",
    fontSize: 16,
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
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  story: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "green",
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
  }
});

export default ArtifactCollector;