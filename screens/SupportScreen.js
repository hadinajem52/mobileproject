import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SupportScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Your message has been sent. We will get back to you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  const faqs = [
    { question: 'How do I send money?', answer: 'Go to Send Money screen, enter recipient details and amount.' },
    { question: 'How do I receive money?', answer: 'Share your unique ID or QR code with the sender.' },
    { question: 'Is my money secure?', answer: 'Yes, we use basic encryption for all transactions.' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#00ea00ff" />
      </TouchableOpacity>
      <Text style={styles.title}>Support & Contact</Text>
      
      <Text style={styles.sectionTitle}>Contact Us</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Your Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Your Message"
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>FAQ</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Customer Service</Text>
      <Text style={styles.contactInfo}>Phone: 1-800-123-4567</Text>
      <Text style={styles.contactInfo}>Email: support@moneytransferapp.com</Text>

      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkButtonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkButton}>
        <Text style={styles.linkButtonText}>Terms of Service</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1f1e',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1e1f1e',
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#2a2b2a',
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#00ea00ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#1e1f1e',
    fontSize: 18,
    fontFamily: 'StackSansHeadline-Medium',
  },
  faqItem: {
    backgroundColor: '#2a2b2a',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  faqQuestion: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
    fontFamily: 'StackSansHeadline-Medium',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#888888',
    fontFamily: 'StackSansHeadline-Regular',
  },
  contactInfo: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 5,
    fontFamily: 'StackSansHeadline-Regular',
  },
  linkButton: {
    backgroundColor: '#666666',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  linkButtonText: {
    color: '#cccccc',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default SupportScreen;