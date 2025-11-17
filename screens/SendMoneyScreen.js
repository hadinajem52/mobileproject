import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SendMoneyScreen = ({ navigation, route }) => {
  const { user, sendMoney } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [scannedFromCamera, setScannedFromCamera] = useState(false);

  useEffect(() => {
    if (route?.params?.recipientFromQR) {
      setRecipient(route.params.recipientFromQR);
      setScannedFromCamera(true);
      // clear param after using
      navigation.setParams({ recipientFromQR: undefined });
    }
  }, [route?.params?.recipientFromQR]);

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
      setScannedFromCamera(false);
      navigation.goBack();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.instruction}>
        Get the recipient's unique ID from their Receive Money screen (copy or QR), or tap "Scan QR" to scan their QR code using your device camera (screenshots are not supported).
      </Text>
      <View style={styles.row}>
        <TextInput
        style={[styles.input, styles.inputRow]}
        placeholder="Recipient ID (e.g., user_12345_abc)"
        placeholderTextColor="#999"
        value={recipient}
        onChangeText={setRecipient}
      />
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('ScanQRCode')}
        >
          <Text style={styles.scanButtonText}>Scan QR</Text>
        </TouchableOpacity>
      </View>
      {scannedFromCamera && (
        <Text style={styles.scannedBadge}>Recipient scanned via camera</Text>
      )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: 'StackSansHeadline-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Regular',
  },
  inputRow: {
    flex: 1,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginLeft: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontFamily: 'StackSansHeadline-Medium',
  },
  scannedBadge: {
    color: '#007bff',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-Medium',
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
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default SendMoneyScreen;