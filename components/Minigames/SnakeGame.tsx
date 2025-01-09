import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Animated, PanResponder } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SnakeGameRouteParams = {
  onPointsUpdate: (points: number) => void;
  gameMode: "addition" | "subtraction" | "multiplication" | "division";
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
  const { onPointsUpdate, gameMode } = route.params;
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [apples, setApples] = useState([{ x: 3, y: 3, number: 5 }]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(0);
  const [correctApple, setCorrectApple] = useState({ x: 0, y: 0 });

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
    for (let i = 0; i < 3; i++) {
      const randomX = Math.floor(Math.random() * 10);
      const randomY = Math.floor(Math.random() * 10);
      const apple = {
        x: randomX,
        y: randomY,
        number: i === 0 ? correctAnswer : Math.floor(Math.random() * 10) + 1,
      };
      newApples.push(apple);
    }

    setApples(newApples);
    setCorrectApple(newApples[0]); // The correct apple will be the first one
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !isGameOver) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0) {
      setIsGameOver(true);
      Alert.alert("Time's Up!", `Your final score is ${score}`, [
        { text: "Restart", onPress: restartGame },
        { text: "Save & Exit", onPress: saveAndExit },
      ]);
    }
  }, [timer, isGameOver]);

  // Snake movement and apple collision
  useEffect(() => {
    if (isGameOver) return;
    const intervalId = setInterval(() => {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };
      const newSnake = [newHead, ...snake.slice(0, snake.length - 1)];
      setSnake(newSnake);

      // Check for apple collision
      apples.forEach((apple) => {
        if (newHead.x === apple.x && newHead.y === apple.y) {
          if (apple.number === answer) {
            setScore((prevScore) => prevScore + 10);
            onPointsUpdate(score + 10);
            generateQuestion(); // Generate new question and apples
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

    return () => clearInterval(intervalId);
  }, [snake, direction, apples, score, isGameOver]);

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

  useEffect(() => {
    generateQuestion(); // Generate a question on game start
  }, []);

  return (
    <View style={styles.container}>
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
});

export default SnakeGame;
