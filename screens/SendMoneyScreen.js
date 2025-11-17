import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';

const SendMoneyScreen = ({ navigation, route }) => {
  const { user, sendMoney, allTransactions } = useAppContext();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [scannedFromCamera, setScannedFromCamera] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (route?.params?.recipientFromQR) {
      setRecipient(route.params.recipientFromQR);
      setScannedFromCamera(true);
      navigation.setParams({ recipientFromQR: undefined });
    }
  }, [route?.params?.recipientFromQR]);

  const validateForm = () => {
    const newErrors = {};
    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient ID is required';
    } else if (!recipient.startsWith('user_')) {
      newErrors.recipient = 'Invalid recipient ID format';
    }
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (numAmount > user.balance) {
        newErrors.amount = 'Insufficient balance';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    try {
      const numAmount = parseFloat(amount);
      const result = sendMoney(user.id, recipient.trim(), numAmount, message);
      if (result.success) {
        Alert.alert('Success', `$${numAmount.toFixed(2)} sent successfully!`);
        setRecipient('');
        setAmount('');
        setMessage('');
        setScannedFromCamera(false);
        setErrors({});
        navigation.goBack();
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsSending(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100];

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
    setErrors({ ...errors, amount: undefined });
  };

  const getRecentRecipients = () => {
    const sentTransactions = allTransactions.filter(t => t.senderId === user.id);
    const uniqueRecipients = [...new Set(sentTransactions.map(t => t.recipientId))];
    return uniqueRecipients.slice(0, 3).map(id => {
      const transaction = sentTransactions.find(t => t.recipientId === id);
      return { id, lastAmount: transaction.amount };
    });
  };

  const recentRecipients = getRecentRecipients();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Send Money</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>${user.balance.toFixed(2)}</Text>
          </View>
        </View>

        <Card style={styles.recipientCard}>
          <Text style={styles.sectionTitle}>Recipient</Text>
          <View style={styles.recipientInputRow}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#cccccc" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.recipient && styles.inputError]}
                placeholder="Recipient ID (e.g., user_12345_abc)"
                placeholderTextColor="#999"
                value={recipient}
                onChangeText={(text) => {
                  setRecipient(text);
                  setErrors({ ...errors, recipient: undefined });
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('ScanQRCode')}
            >
              <Ionicons name="qr-code-outline" size={20} color="#1e1f1e" />
              <Text style={styles.scanButtonText}>Scan</Text>
            </TouchableOpacity>
          </View>
          {errors.recipient && <Text style={styles.errorText}>{errors.recipient}</Text>}
          {scannedFromCamera && (
            <View style={styles.scannedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#00ea00ff" />
              <Text style={styles.scannedBadgeText}>Scanned via camera</Text>
            </View>
          )}
        </Card>

        {recentRecipients.length > 0 && (
          <Card style={styles.recentCard}>
            <Text style={styles.sectionTitle}>Recent Recipients</Text>
            <View style={styles.recentList}>
              {recentRecipients.map((recipient) => (
                <TouchableOpacity
                  key={recipient.id}
                  style={styles.recentItem}
                  onPress={() => setRecipient(recipient.id)}
                >
                  <Ionicons name="person-circle-outline" size={32} color="#00ea00ff" />
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentId}>{recipient.id}</Text>
                    <Text style={styles.recentAmount}>Last sent: ${recipient.lastAmount.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}

        <Card style={styles.amountCard}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash-outline" size={20} color="#cccccc" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.amount && styles.inputError]}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setErrors({ ...errors, amount: undefined });
              }}
              keyboardType="decimal-pad"
            />
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

          <View style={styles.quickAmounts}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.quickAmountButton}
                onPress={() => handleQuickAmount(value)}
              >
                <Text style={styles.quickAmountText}>${value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.messageCard}>
          <Text style={styles.sectionTitle}>Message (Optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="chatbubble-outline" size={20} color="#cccccc" style={styles.inputIcon} />
            <TextInput
              style={[styles.messageInput]}
              placeholder="Add a note..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
            />
          </View>
        </Card>

        <TouchableOpacity
          style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="#1e1f1e" />
          ) : (
            <>
              <Ionicons name="send-outline" size={20} color="#1e1f1e" />
              <Text style={styles.sendButtonText}>Send Money</Text>
            </>
          )}
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
    flex: 1,
    backgroundColor: '#1e1f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
    flex: 1,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
  },
  balanceAmount: {
    fontSize: 16,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-Medium',
  },
  recipientCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'StackSansHeadline-Medium',
    marginBottom: 12,
  },
  recipientInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2a2b2a',
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  scanButton: {
    backgroundColor: '#00ea00ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scanButtonText: {
    color: '#1e1f1e',
    fontFamily: 'StackSansHeadline-Medium',
    marginLeft: 4,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'StackSansHeadline-Regular',
  },
  scannedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#00ea00ff20',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  scannedBadgeText: {
    color: '#00ea00ff',
    fontSize: 14,
    fontFamily: 'StackSansHeadline-Medium',
    marginLeft: 6,
  },
  recentCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  recentList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recentItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2a2b2a',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  recentInfo: {
    alignItems: 'center',
    marginTop: 8,
  },
  recentId: {
    fontSize: 12,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
    textAlign: 'center',
  },
  recentAmount: {
    fontSize: 10,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-Medium',
  },
  amountCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  quickAmountText: {
    color: '#cccccc',
    fontSize: 14,
    fontFamily: 'StackSansHeadline-Medium',
  },
  messageCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#2a2b2a',
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
    height: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#00ea00ff',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  sendButtonText: {
    color: '#1e1f1e',
    fontSize: 18,
    fontFamily: 'StackSansHeadline-Medium',
    marginLeft: 8,
  },
});

export default SendMoneyScreen;