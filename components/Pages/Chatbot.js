import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleUserMessageChange = (text) => {
    setUserMessage(text);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return; // Prevent sending empty messages
  
    // Add the user message to the chat
    const newMessages = [...messages, { sender: "user", text: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setIsTyping(true);
  
    let retries = 3; // Retry up to 3 times if we hit a rate limit
    while (retries > 0) {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 300,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer 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`, // Move this to a backend
            },
          }
        );
  
        // Add AI response to the chat
        const aiResponse = {
          sender: "ai",
          text: response.data.choices[0].message.content.trim(),
        };
  
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
        setIsTyping(false);
        return;
      } catch (error) {
        if (error.response?.status === 429) {
          console.warn("Rate limit hit. Retrying in 2 seconds...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          console.error("Error fetching AI response:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "ai", text: "Sorry, something went wrong. Please try again later." },
          ]);
          setIsTyping(false);
          return;
        }
      }
      retries--;
    }
  
    setIsTyping(false);
  };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>Have a question? Chat with Dr. Octo!</Text>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[styles.message, message.sender === 'user' ? styles.userMessage : styles.aiMessage]}
          >
            <Text style={styles.sender}>{message.sender === 'user' ? 'You' : 'Dr. Octo'}:</Text>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userMessage}
          onChangeText={handleUserMessageChange}
          placeholder="Type a message..."
          multiline
        />

        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Icon name="send" size={30} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {isTyping && <Text style={styles.typingText}>AI is typing...</Text>}
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  userMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  aiMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-end',
  },
  sender: {
    fontWeight: 'bold',
  },
  messageText: {
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginBottom: 90,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  typingText: {
    fontStyle: 'italic',
    color: '#888',
  },
});

export default Chatbot;