import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, PanResponder, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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
          Alert.alert("Game Over", `Your final score is ${score}`, [
            { text: "Restart", onPress: restartGame },
            { text: "Save & Exit", onPress: saveAndExit },
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
      <View style={styles.instructionScreen}>
        <Text style={styles.instructionText}>Welcome to Snake Math Game!</Text>
        <Text style={styles.detailedInstructionsTitle}>How to Play:</Text>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionItem}>• Swipe to guide your snake to the correct apple.</Text>
          <Text style={styles.instructionItem}>• Solve math problems to find the correct apple.</Text>
          <Text style={styles.instructionItem}>• Avoid wrong apples and walls until the timer runs out.</Text>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
          <Text style={styles.startText}>Start Game</Text>
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
    backgroundColor: "#f0f8ff",
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
    width: 300,
    height: 300,
    position: "relative",
    backgroundColor: "#dcdcdc",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "black",
  },
  snake: {
    position: "absolute",
    width: 30,
    height: 30,
    backgroundColor: "green",
  },
  apple: {
    position: "absolute",
    width: 30,
    height: 30,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
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