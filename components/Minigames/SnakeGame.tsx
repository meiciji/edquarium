import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, PanResponder, TouchableOpacity, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SnakeGameRouteParams = {
  onPointsUpdate: (points: number, section: string) => void;
  onGameComplete: (section: string) => void;
  gameMode: "addition" | "subtraction" | "multiplication" | "division";
  section: string;
};

type SnakeGameProps = {
  navigation: StackNavigationProp<any>;
  route: RouteProp<{ SnakeGame: SnakeGameRouteParams }, "SnakeGame">;
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const SnakeGame: React.FC<SnakeGameProps> = ({ route, navigation }) => {
  const { onPointsUpdate, onGameComplete, gameMode, section } = route.params;
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [apples, setApples] = useState([{ x: 3, y: 3, number: 5 }]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [correctApple, setCorrectApple] = useState({ x: 0, y: 0 });
  const [showInstructions, setShowInstructions] = useState(true); // State to control instruction screen visibility
  const [achievement, setAchievement] = useState(""); // State for achievement
  const achievements = {
    Storytelling: "Master of Storytelling",
    Spelling: "Master of Spelling",
    Grammar: "Master of Grammar",
    Comprehension: "Master of Comprehension",
  };

  const addToDashboard = async () => {
    try {
      // Retrieve the saved achievements from AsyncStorage
      const savedAchievements = await AsyncStorage.getItem("achievements");
      
      // If there are saved achievements, parse them. Otherwise, initialize an empty array.
      const achievementsList = savedAchievements ? JSON.parse(savedAchievements) : [];
  
      // Check if the achievement is already in the list
      if (!achievementsList.includes(achievement)) {
        // If the achievement is not already in the list, add it
        achievementsList.push(achievement);
  
        // Save the updated achievements list back to AsyncStorage
        await AsyncStorage.setItem("achievements", JSON.stringify(achievementsList));
  
        // Show a success alert informing the user that the achievement was added
        Alert.alert("Success", "Achievement added to dashboard!", [
          { text: "OK" }, // OK button to dismiss the alert
          { text: "Save and Exit", onPress: () => navigation.goBack() } 
        ]);
      } else {
        // If the achievement is already in the list, inform the user
        Alert.alert("Info", "Achievement already added to dashboard.", [
          { text: "OK" },
          { text: "Save and Exit", onPress: () => navigation.goBack() } 
        ]);
      }
    } catch (error) {
      // Log any error that occurs during the process
      console.error("Failed to save achievement", error);
    }
  };

  // Function to generate a random question based on the game mode
  const generateQuestion = () => {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let questionText = "";
    let correctAnswer = 0;

    switch (gameMode) {
      case "addition":
        questionText = `${num1} + ${num2}`;
        correctAnswer = num1 + num2;
        break;
      case "subtraction":
        questionText = `${num1} - ${num2}`;
        correctAnswer = num1 - num2;
        break;
      case "multiplication":
        questionText = `${num1} × ${num2}`;
        correctAnswer = num1 * num2;
        break;
      case "division":
        // Ensure num1 is divisible by num2 for whole number results
        if (num1 % num2 !== 0) {
          num1 = num2 * (Math.floor(Math.random() * 10) + 1);
        }
        questionText = `${num1} ÷ ${num2}`;
        correctAnswer = num1 / num2;
        break;
    }

    setQuestion(questionText);
    setAnswer(correctAnswer);

    // Generate apples with one containing the correct answer
    const newApples = [];
    const correctAppleIndex = Math.floor(Math.random() * 3); // Randomly choose one apple to be correct
    for (let i = 0; i < 3; i++) {
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);
      const apple = {
        x: randomX,
        y: randomY,
        number: i === correctAppleIndex ? correctAnswer : Math.floor(Math.random() * 10) + 1,
      };
      newApples.push(apple);
    }

    setApples(newApples);
    setCorrectApple(newApples[correctAppleIndex]); // The correct apple will be the one at correctAppleIndex
  };

  // Timer countdown
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (timer > 0 && !isGameOver && !showInstructions) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsGameOver(true);
      onGameComplete(section); // Mark the section as complete
      Alert.alert("Time's Up!", `Your final score is ${score}`, [
        { text: "Restart", onPress: restartGame },
        { text: "Save & Exit", onPress: saveAndExit },
      ]);
    }
    return () => clearInterval(intervalId);
  }, [timer, isGameOver, showInstructions]);

  // Snake movement and apple collision
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!isGameOver && !showInstructions) {
      intervalId = setInterval(() => {
        const newHead = {
          x: snake[0].x + direction.x,
          y: snake[0].y + direction.y,
        };
        const newSnake = [newHead, ...snake];

        // Check for apple collision
        let ateApple = false;
        apples.forEach((apple) => {
          if (newHead.x === apple.x && newHead.y === apple.y) {
            if (apple.number === answer) {
              setScore((prevScore) => prevScore + 10);
              onPointsUpdate(score + 10, section);
              generateQuestion(); // Generate new question and apples
              ateApple = true;
            } else {
              setIsGameOver(true);
              clearInterval(intervalId);
              Alert.alert("Wrong Apple! Game Over", `Your final score is ${score}`, [
                { text: "Restart", onPress: restartGame },
                { text: "Save & Exit", onPress: saveAndExit },
              ]);
            }
          }
        });

        if (!ateApple) {
          newSnake.pop(); // Remove the tail if no apple was eaten
        }

        setSnake(newSnake);

        // Check for wall or self-collision
        if (
          newHead.x < 0 ||
          newHead.x >= 10 ||
          newHead.y < 0 ||
          newHead.y >= 10 ||
          snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          clearInterval(intervalId);
          Alert.alert("Game over.", `Your final score is ${score}.`, [
            { text: "Restart", onPress: restartGame },
            { text: "Save and Exit", onPress: saveAndExit },
          ]);
        }
      }, 300);
    }

    return () => clearInterval(intervalId);
  }, [snake, direction, apples, score, isGameOver, showInstructions]);

  const restartGame = () => {
    setSnake([{ x: 5, y: 5 }]);
    setDirection(DIRECTIONS.RIGHT);
    setScore(0);
    setTimer(30);
    setIsGameOver(false);
    generateQuestion();
  };

  const saveAndExit = () => {
    navigation.goBack();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, gestureState) => {
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        setDirection(dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT);
      } else {
        setDirection(dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP);
      }
    },
  });

  const onStartGame = () => {
    setShowInstructions(false);
    generateQuestion(); // Generate a question on game start
  };

  const InstructionScreen: React.FC<{ onStartGame: () => void }> = ({ onStartGame }) => {
    return (
        <View style={styles.slide}>
          <Image
            source={require("../../assets/images/jelly.png")} // Replace with your actual image
            style={styles.image}
          />
          <Text style={styles.title}>Instructions</Text>
          <Text style={styles.description}>
          • Swipe to guide your snake to the correct apple and solve math problems.
          </Text>
          <Text style={styles.description}>
          • Avoid wrong apples and walls until the timer runs out.
          </Text>
          <TouchableOpacity style={styles.button} onPress={onStartGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        </View>
    );
  };

  return (
    <View style={styles.container}>
      {showInstructions ? (
        <InstructionScreen onStartGame={onStartGame} />
      ) : (
        <>
          <Text style={styles.timer}>Time: {timer}s</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.question}>{question}</Text>
          <View style={styles.gameArea} {...panResponder.panHandlers}>
            {apples.map((apple, index) => (
              <View key={index} style={[styles.apple, { left: apple.x * 30, top: apple.y * 30 }]}>
                <Text style={styles.appleText}>{apple.number}</Text>
                <View style={[styles.appleStem, { left: 12 }]} />
              </View>
            ))}
            {snake.map((segment, index) => (
              <View
                key={index}
                style={[styles.snake, { left: segment.x * 30, top: segment.y * 30 }]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DFF7F9",
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DFF7F9", // Background color for the slide
    padding: 20,
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
  timer: {
    fontSize: 20,
    marginBottom: 10,
  },
  score: {
    fontSize: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gameArea: {
    width: 350,
    height: 350,
    position: "relative",
    backgroundColor: "#dcdcdc",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 50,
  },
  snake: {
    position: "absolute",
    width: 40, // Keeping a reasonable width for a cute snake
    height: 40, // Making it slightly more circular to soften the shape
    backgroundColor: "#32CD32", // A lighter, friendlier green
    borderRadius: 20, // Fully rounded to make it look like a soft, rounded cylinder
    borderWidth: 2, // A slight border for a more defined look
    borderColor: "#228B22", // A darker green for the border, complementing the snake color
    shadowColor: "#228B22", // Soft shadow to give a bit of depth
    shadowOffset: { width: 0, height: 3 }, // Slight shadow below to lift it
    shadowOpacity: 0.2, // Low opacity for the shadow
    shadowRadius: 3, // Slight shadow blur for a soft look
  },  
  apple: {
    position: "absolute",
    width: 40, // Slightly bigger to make the apple more prominent
    height: 35, // Make it a little more vertically elongated to resemble an apple's shape
    backgroundColor: "#FF6347", // A richer, reddish color for the apple
    borderRadius: 25, // Round the corners for a more organic look
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B0000", // Dark shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    transform: [{ scaleX: 1.1 }, { scaleY: 1.2 }], // Slightly stretched to make the apple more organic
  },
  appleStem: {
    position: "absolute",
    top: -8, // Placing the stem above the apple
    left: "90%",
    transform: [{ translateX: 3 }], // Center the stem horizontally
    width: 8,
    height: 11,
    backgroundColor: "green", // Brown color for the stem
    borderRadius: 2, // Slightly rounded edges for the stem
  },
  appleText: {
    color: "white",
    fontWeight: "bold",
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

export default SnakeGame;