import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RouteParams {
  gameMode: 'Storytelling' | 'Spelling' | 'Grammar' | 'Comprehension';
  onPointsUpdate: (points: number) => void;
  onGameComplete: (gameMode: string) => void;
}

const LanguageArtsGame = ({ route, navigation }: { route: { params: RouteParams }, navigation: any }) => {
  const { gameMode, onPointsUpdate, onGameComplete } = route.params;

  const [questions, setQuestions] = useState<any>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [gameComplete, setGameComplete] = useState(false); // New state to track game completion
  const [achievement, setAchievement] = useState(""); // State for achievement

  const achievements = {
    Storytelling: "Master of Storytelling",
    Spelling: "Master of Spelling",
    Grammar: "Master of Grammar",
    Comprehension: "Master of Comprehension",
  };

  useEffect(() => {
    const generatedQuestions = generateQuestions(gameMode);
    setQuestions(generatedQuestions);
    setAchievement(achievements[gameMode]); // Set the achievement based on the game mode
  }, [gameMode]);

  const handleComplete = (isCorrect: boolean) => {
    const pointsEarned = isCorrect ? 10 : 0;
    onPointsUpdate(pointsEarned);
    setScore(score + pointsEarned);

    if (isCorrect) {
      setAnswerFeedback("Correct! Well done!");
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswerFeedback(null);
        setInputText(""); // Reset input text
      }, 1500);
    } else {
      setAnswerFeedback("Oops! Try again.");
    }

    // Check if all questions are answered
    if (currentQuestionIndex === questions.length - 1) {
      setGameComplete(true); // Mark the game as complete
      onGameComplete(gameMode); // Call onGameComplete when the game is complete
    }
  };

  const skipInstruction = () => setShowInstruction(false);

  const currentQuestion = questions[currentQuestionIndex];

  const addToDashboard = async () => {
    try {
      const savedAchievements = await AsyncStorage.getItem("achievements");
      const achievementsList = savedAchievements ? JSON.parse(savedAchievements) : [];
  
      if (!achievementsList.includes(achievement)) {
        achievementsList.push(achievement);
        await AsyncStorage.setItem("achievements", JSON.stringify(achievementsList));
        Alert.alert("Success", "Achievement added to dashboard!", [
          { text: "OK" },
          { text: "Save and Exit", onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert("Info", "Achievement already added to dashboard.", [
          { text: "OK" },
          { text: "Save and Exit", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error("Failed to save achievement", error);
    }
  };

  return (
    <View style={styles.container}>
      {showInstruction ? (
        <InstructionScreen gameMode={gameMode} onSkip={skipInstruction} />
      ) : gameComplete ? (
        <CongratsScreen score={score} achievement={achievement} onAddToDashboard={addToDashboard} onGameComplete={onGameComplete} gameMode={gameMode} />
      ) : currentQuestion ? (
        <>
          <Text style={styles.title}>{gameMode} Game</Text>
          <Text style={styles.score}>Score: {score}</Text>
          {gameMode === 'Spelling' ? (
            <SpellingQuestion
              question={currentQuestion}
              inputText={inputText}
              setInputText={setInputText}
              onComplete={handleComplete}
            />
          ) : (
            <Question
              question={currentQuestion}
              onAnswerSelected={setSelectedAnswer}
              selectedAnswer={selectedAnswer}
              onComplete={handleComplete}
            />
          )}
          {answerFeedback && <Text style={styles.feedback}>{answerFeedback}</Text>}
        </>
      ) : (
        <Text style={styles.title}>No more questions!</Text>
      )}
    </View>
  );
};

const CongratsScreen = ({ score, achievement, onAddToDashboard, onGameComplete, gameMode }: any) => {
  useEffect(() => {
    onGameComplete(gameMode); // Call onGameComplete when the CongratsScreen is rendered
  }, [onGameComplete, gameMode]);

  return (
    <View style={styles.congratsScreen}>
      <Text style={styles.congratsTitle}>Congrats! You won!</Text>
      <Text style={styles.pointsText}>Points earned this round: {score}</Text>
      <Text style={styles.achievementText}>Achievement unlocked: {achievement}</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddToDashboard}>
        <Text style={styles.addButtonText}>Add to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const InstructionScreen = ({ gameMode, onSkip }: any) => {
  let instructionText = "";
  let detailedInstructions: any[] = [];

  if (gameMode === "Storytelling") {
    instructionText = "Storytelling Game";
    detailedInstructions = [
      "You will be presented with a sentence.",
      "Select the option that best represents the main idea of the sentence.",
      "Focus on understanding the key message conveyed in the sentence."
    ];
  } else if (gameMode === "Spelling") {
    instructionText = "Spelling Game";
    detailedInstructions = [
      "You will see an image related to a word.",
      "Your task is to type the word that corresponds to the image.",
      "Pay attention to the details and make sure to spell the word correctly."
    ];
  } else if (gameMode === "Grammar") {
    instructionText = "Grammar Game";
    detailedInstructions = [
      "You will be given a sentence with a missing punctuation mark.",
      "Choose the correct punctuation mark from the options provided.",
      "Punctuation is crucial for proper sentence structure!"
    ];
  } else if (gameMode === "Comprehension") {
    instructionText = "Comprehension Game";
    detailedInstructions = [
      "You will be presented with a passage or a question.",
      "Select the answer that best matches the information in the passage.",
      "Focus on understanding the main point of the passage or question."
    ];
  }

  return (
    <View style={styles.instructionScreen}>
      <Text style={styles.instructionText}>{instructionText}</Text>
      <Text style={styles.detailedInstructionsTitle}>Instructions:</Text>
      <View style={styles.instructionsList}>
        {detailedInstructions.map((instruction, index) => (
          <Text key={index} style={styles.instructionItem}>• {instruction}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
};
  

const generateQuestions = (mode: string) => {
    switch (mode) {
      case "Storytelling":
        return [
          {
            id: "1",
            question: "What is the main idea of this sentence?",
            story: "The dog went to the park to play with its friends.",
            options: ["dog", "park", "play", "friends"],
            correct: "dog",
          },
          {
            id: "2",
            question: "What is the main action in this sentence?",
            story: "The bird flew over the river to reach the mountain.",
            options: ["bird", "flew", "river", "mountain"],
            correct: "flew",
          },
          {
            id: "3",
            question: "What is the main idea of this sentence?",
            story: "The children laughed as they played on the swings.",
            options: ["children", "laughed", "swings", "played"],
            correct: "children",
          },
          {
            id: "4",
            question: "What is the setting in this sentence?",
            story: "In the forest, the squirrel gathered nuts for the winter.",
            options: ["forest", "squirrel", "gathered", "winter"],
            correct: "forest",
          },
          {
            id: "5",
            question: "What is the main idea of this sentence?",
            story: "The car zoomed down the road during the rainstorm.",
            options: ["car", "zoomed", "road", "rainstorm"],
            correct: "car",
          },
        ];
  
      case "Spelling":
        return [
          {
            id: "1",
            image: require("../../assets/images/cat.png"),
            correctWord: "cat",
          },
          {
            id: "2",
            image: require("../../assets/images/dog.png"),
            correctWord: "dog",
          },
          {
            id: "3",
            image: require("../../assets/images/apple.png"),
            correctWord: "apple",
          },
          {
            id: "4",
            image: require("../../assets/images/book.png"),
            correctWord: "book",
          },
          {
            id: "5",
            image: require("../../assets/images/chipotle.png"),
            correctWord: "chipotle",
          },
        ];
  
        case "Grammar":
          return [
            {
              id: "1",
              question: "What punctuation mark is needed to complete this exclamatory sentence?",
              sentence: "What a beautiful day__",
              options: [".", "?", "!"],
              correct: "!",
            },
            {
              id: "2",
              question: "Which punctuation mark correctly joins these two independent clauses?",
              sentence: "I wanted to go to the park__ it started raining.",
              options: [".", ",", ";"],
              correct: ",",
            },
            {
              id: "3",
              question: "Select the sentence that uses proper punctuation for a compound sentence.",
              sentence: "My favorite color is blue and my sister loves green.",
              options: [
                "My favorite color is blue, and my sister loves green.",
                "My favorite color is blue and, my sister loves green.",
                "My favorite color is blue and my sister loves green.",
              ],
              correct: "My favorite color is blue, and my sister loves green.",
            },
            {
              id: "4",
              question: "Which punctuation mark is appropriate to end this question?",
              sentence: "Hello, how are you doing today__",
              options: [".", "!", "?"],
              correct: "?",
            },
            {
              id: "5",
              question: "What punctuation mark should be added after the introductory phrase?",
              sentence: "After the show__ we went for ice cream.",
              options: [",", ".", ";"],
              correct: ",",
            },
          ];  
  
      case "Comprehension":
        return [
          {
            id: "1",
            question: "Max is a small dog. He loves to run in the park. Every morning, he chases his ball and plays with his friends. Max is always happy when he is outside.",
            options: ["Sleep all day", "Run in the park", "Eat food", "Watch TV"],
            correct: "Run in the park",
          },
          {
            id: "2",
            question: "Lily saw a big, red apple on the tree. She picked it and took a bite. It was juicy and sweet. Lily smiled because it was the best apple she had ever tasted.",
            options: ["Green", "Yellow", "Red", "Blue"],
            correct: "Red",
          },
          {
            id: "3",
            question: "A bee flew from flower to flower. It was collecting pollen to take back to the hive. The bee worked hard all day long, flying around the garden.",
            options: ["Playing", "Collecting pollen", "Eating honey", "Flying to the moon"],
            correct: "Collecting pollen",
          },
          {
            id: "4",
            question: "There is a tall tree in the park. It has many branches and green leaves. In the fall, the leaves turn orange and red. People like to sit under the tree and read books.",
            options: ["They fall off", "They turn orange and red", "They grow bigger", "They stay green"],
            correct: "They turn orange and red",
          },
          {
            id: "5",
            question: "Freddy is a little frog who loves to jump. He jumps from one rock to another in the pond. Freddy is friendly and likes to visit his frog friends. They play together all day.",
            options: ["In the house", "From tree to tree", "From rock to rock", "From cloud to cloud"],
            correct: "From rock to rock",
          },
        ];
  
      default:
        return [];
    }
  };  

const SpellingQuestion = ({
  question,
  inputText,
  setInputText,
  onComplete,
}: any) => {
  const handleSubmit = () => {
    const isCorrect = inputText.toLowerCase().trim() === question.correctWord.toLowerCase();
    onComplete(isCorrect);
  };

  return (
    <View style={styles.spellingContainer}>
      <Image source={question.image} style={styles.image} />
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type the word here"
        keyboardType="default"
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const Question = ({ question, onAnswerSelected, selectedAnswer, onComplete }: any) => {
  const handleAnswerSelect = (answer: string) => {
    onAnswerSelected(answer);
    const isCorrect = answer === question.correct;
    onComplete(isCorrect);
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>{question.question}</Text>
      <Text style={styles.story}>{question.story || question.sentence}</Text>
      <View style={styles.optionsContainer}>
        {question.options?.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedAnswer === option ? styles.selectedOption : {},
            ]}
            onPress={() => handleAnswerSelect(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFF8E1", // Orange theme background
    alignItems: "center",
  },
  instructionScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    padding: 20,
  },
  instructionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#FF7043", // Orange text for instructions
  },
  skipButton: {
    backgroundColor: "#FF7043", // Orange button
    padding: 10,
    borderRadius: 5,
  },
  skipText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF7043", // Orange title
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: "#FF7043",
  },
  feedback: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745", // Green feedback
    marginTop: 10,
  },
  spellingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginTop: 40,
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "#FF7043",
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#FF7043", // Orange button
    padding: 10,
    borderRadius: 5,
  },
  submitText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  questionContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7043",
    textAlign: "center",
    marginBottom: 10,
  },
  story: {
    fontSize: 20,
    marginBottom: 20,
    color: "#FF7043",
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  option: {
    backgroundColor: "#FFD180", // Light orange for options
    padding: 15,
    borderRadius: 5,
    margin: 10,
    width: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedOption: {
    backgroundColor: "#FF7043", // Highlight selected option
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7043",
  },
  detailedInstructionsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF7043", // Orange title for instructions
    textAlign: "center",
    marginBottom: 15,
  },
  instructionsList: {
    marginBottom: 30,
    alignItems: "flex-start", // Aligning items to the left for bullet points
    paddingHorizontal: 20, // Add some padding to the left for bullets
  },
  instructionItem: {
    fontSize: 18,
    color: "#FF7043", // Orange text for instructions
    marginBottom: 8,
    fontWeight: "500", // Slightly bold for better readability
  },
  detailedInstructions: {
    fontSize: 16,
    color: "#FF7043", // Orange text for detailed instructions
    marginBottom: 20,
    textAlign: "center",
  },  
  congratsScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  congratsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pointsText: {
    fontSize: 18,
    marginBottom: 10,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LanguageArtsGame;