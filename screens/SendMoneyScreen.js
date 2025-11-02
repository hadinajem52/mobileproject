import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAppContext } from '../context/AppContext';

const SendMoneyScreen = ({ navigation }) => {
  const { user, sendMoney } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please enter recipient ID and amount');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    // Ensure recipient looks like a unique ID
    if (!recipient.startsWith('user_')) {
      Alert.alert('Error', 'Recipient must be a valid user ID. Copy it from the recipient\'s Receive Money screen.');
      return;
    }

    const result = sendMoney(user.id, recipient.trim(), numAmount, message);
    if (result.success) {
      Alert.alert('Success', `Money sent successfully!`);
      setRecipient('');
      setAmount('');
      setMessage('');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Money</Text>
      <Text style={styles.instruction}>
        Get the recipient's unique ID from their Receive Money screen (copy button) and paste it below.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Recipient ID (e.g., user_12345_abc)"
        placeholderTextColor="#999"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#999"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Optional Message"
        placeholderTextColor="#999"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send Money</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SendMoneyScreen;