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
  const { balance, addTransaction } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in recipient and amount');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }
    // Mock send money
    const transaction = {
      id: Date.now().toString(),
      type: 'Sent',
      amount: -numAmount,
      recipient,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
    };
    addTransaction(transaction);
    Alert.alert('Success', `Money sent to ${recipient}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Money</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipient ID/Phone/Email"
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
    marginBottom: 20,
    color: '#333',
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