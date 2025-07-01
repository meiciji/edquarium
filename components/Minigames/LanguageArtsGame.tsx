import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Alert, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

interface RouteParams {
  gameMode: 'Storytelling' | 'Spelling' | 'Grammar' | 'Comprehension';
  onPointsUpdate: (points: number) => void;
  onGameComplete: (gameMode: string) => void;
}
interface SpellingQuestionProps {
  question: { lesson: number; correctWord: string; image: any };
  inputText: string;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
  onComplete: (isCorrect: boolean) => void;
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
        // If this was the last question, mark game as complete
        if (currentQuestionIndex === questions.length - 1) {
          setGameComplete(true);
          onGameComplete(gameMode);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setAnswerFeedback(null);
          setInputText(""); // Reset input text
        }
      }, 400);
    } else {
      setAnswerFeedback("Oops! Try again.");
    }
  };

  const skipInstruction = () => setShowInstruction(false);

  const currentQuestion = questions[currentQuestionIndex];

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
  const scaleAnim = useRef(new Animated.Value(0)).current; // Scale starts at 0

  useEffect(() => {
    onGameComplete(gameMode);

    // Jump-in effect
    Animated.spring(scaleAnim, {
      toValue: 1.2, // Grows larger
      friction: 3, // Smooth effect
      useNativeDriver: true,
    }).start(() => {
      // Wobble effect after jump-in
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9, // Shrinks slightly
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1, // Expands
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, // Settles to normal size
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [onGameComplete, gameMode]);

  return (
    <View style={styles.container}>
      {/* Animated View for Jump-In & Wobble */}
      <Animated.View style={[styles.profileContainer, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.badge}>
          <Image source={require("../../assets/images/winning.png")} style={styles.crown} />
          <Text style={styles.username}>You Won!</Text>
        </View>
      

      {/* Score Display */}
      <Text style={styles.winningScore}>{score}</Text>
      <Text style={styles.scoreLabel}>Score</Text>

      <Text style={styles.achievementText}>Achievement unlocked: {achievement}</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddToDashboard}>
        <Text style={styles.addButtonText}>Add to Dashboard</Text>
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Ionicons name="share-social-outline" size={24} color="#7a77ff" />
      </TouchableOpacity>
      </Animated.View>
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
       <Image
      source={require("../../assets/images/9.png")} // Replace with your actual image
      style={styles.headerImage}
    />
      <Text style={styles.instructionText}>{instructionText}</Text>
      <Text style={styles.title}>Instructions:</Text>
      <View>
        {detailedInstructions.map((instruction, index) => (
          <Text key={index} style={styles.description}>• {instruction}</Text>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onSkip}>
        <Text style={styles.buttonText}>Start Game</Text>
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
            image: require("../../assets/images/catSpelling.png"),
            correctWord: "cat",
          },
          {
            id: "2",
            image: require("../../assets/images/puppy.png"),
            correctWord: "dog",
          },
          {
            id: "3",
            image: require("../../assets/images/panda.png"),
            correctWord: "panda",
          },
          {
            id: "4",
            image: require("../../assets/images/owl.png"),
            correctWord: "owl",
          },
          {
            id: "5",
            image: require("../../assets/images/koala.png"),
            correctWord: "koala",
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

  const SpellingQuestion: React.FC<SpellingQuestionProps> = ({ question, inputText, setInputText, onComplete }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate input: only lowercase English letters allowed
  const handleChangeText = (text: string) => {
    if (/^[a-z]*$/.test(text)) {
      setInputText(text);
      setError(null);
    } else {
      setError("Please use only lowercase English letters (a-z).");
    }
  };

  const handleSubmit = () => {
    if (!inputText) {
      setFeedback("Please enter a word.");
      return;
    }
    if (inputText.length !== question.correctWord.length) {
      setFeedback("Check the word length!");
      return;
    }
    if (error) {
      setFeedback("Fix the input error before submitting.");
      return;
    }
    const isCorrect = inputText === question.correctWord;
    setFeedback(isCorrect ? "Correct! 🎉" : "Incorrect. Try again. ❌");
    setTimeout(() => {
      setFeedback(null);
      setInputText("");
      onComplete(isCorrect);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>Which animal is this?</Text>
      <Image source={question.image} style={styles.image} />
      <TextInput
        style={styles.spellingInput}
        value={inputText}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Type the word"
        maxLength={question.correctWord.length}
        keyboardType="default"
      />
      {error && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
      {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}
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
  questionText: {
    marginTop: 50,
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  wordContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  letterBox: {
    width: 40,
    height: 40,
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
  },
  lettersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20
  },
  letterButton: {
    width: 40,
    height: 40,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFCDD2',
    borderRadius: 8,
  },
  letterText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F48FB1',
    borderRadius: 8,
  },
  submitText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', // Green for correct feedback
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
    fontSize: 16,
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
    marginTop: 10,
    marginBottom: 60,
  },
  headerImage: {
    width: 300,
    height: 300,
    marginBottom: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  spellingInput: {
    width: 160,
    height: 40,
    fontSize: 22,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    textAlign: 'center',
    paddingVertical: 0,
    textAlignVertical: 'center', // for Android
    paddingTop: 8, // for iOS vertical centering
    paddingBottom: 8, // for iOS vertical centering
    marginBottom: 10,
  },
  score: {
    fontSize: 24,
    color: "#FF7043",
  },
  profileContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  badge: {
    alignItems: "center",
  },
  crown: {
    position: "absolute",
    marginTop: 50,
    width: 310,
    height: 160,
    marginBottom: 50,
  },
  username: {
    marginTop: 200,
    fontSize: 20,
    fontWeight: "bold",
  },
  winningScore: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  scoreLabel: {
    fontSize: 18,
    color: "#555",
  },
  shareButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "#f0f0ff",
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
    fontSize: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#f28d9f',
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#fff',
    width: 210,
    height: 50, // Increased height for better vertical centering
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold', // Makes the text stand out
    textAlign: 'center', // Ensures text is centered
  },  
});

export default LanguageArtsGame;