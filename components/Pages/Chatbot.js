import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';  // Import axios for API requests

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleUserMessageChange = (text) => {
    setUserMessage(text);
  };

  const handleSendMessage = async () => {
    if (!userMessage) return;

    // Add the user message to the chat
    const newMessages = [
      ...messages,
      { sender: 'user', text: userMessage },
    ];
    setMessages(newMessages);
    setUserMessage("");
    setIsTyping(true);

    try {
      // Make an API call to OpenAI's GPT-3 (or GPT-4) model
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', // OpenAI API endpoint
        {
          model: 'gpt-4o-mini', // Use the appropriate GPT-4 or GPT-3 model here
          messages: [
            { role: 'user', content: userMessage }, // Passing the user message to the API
          ],
          max_tokens: 300,
          temperature: 0.7,
        },
        {
          headers: {
            'Authorization': `Bearer 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`, // Replace with your OpenAI API key
          },
        }
      );

      const aiResponse = {
        sender: 'ai',
        text: response.data.choices[0].message.content.trim(), // Correct way to access AI response
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error("Error fetching AI response: ", error);
      console.error("Error details: ", error.response ? error.response.data : error.message);
      console.log("Error response data:", error.response ? error.response.data : "No response data");
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', text: "Sorry, something went wrong." },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Heading */}
      <Text style={styles.header}>Have a question? Chat with AI!</Text>

      {/* Messages Area */}
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

      {/* Input and Send button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userMessage}
          onChangeText={handleUserMessageChange}
          placeholder="Type a message..."
          multiline
        />

        {/* Send Icon as TouchableOpacity */}
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Icon name="send" size={30} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {/* Typing indicator */}
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