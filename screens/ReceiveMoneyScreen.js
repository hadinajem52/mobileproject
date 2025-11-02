import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Clipboard,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '../context/AppContext';

const ReceiveMoneyScreen = ({ navigation }) => {
  const { user, requestMoney } = useAppContext();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const userId = user?.id || 'Not logged in';

  const handleRequestMoney = () => {
    setShowRequestModal(true);
  };

  const submitMoneyRequest = () => {
    if (!targetUser || !requestAmount) {
      Alert.alert('Error', 'Please enter target user and amount');
      return;
    }

    const numAmount = parseFloat(requestAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const result = requestMoney(user.id, targetUser.trim(), numAmount, requestMessage);
    if (result.success) {
      Alert.alert('Success', 'Money request sent successfully!');
      setShowRequestModal(false);
      setTargetUser('');
      setRequestAmount('');
      setRequestMessage('');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const showQRCode = () => {
    Alert.alert(
      'Your QR Code',
      'Show this QR code to others so they can send you money by scanning it.',
      [{ text: 'OK' }]
    );
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setString(userId);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive Money</Text>

      <View style={styles.idContainer}>
        <Text style={styles.label}>Your Unique ID:</Text>
        <Text style={styles.userId}>{userId}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.qrContainer}>
        <Text style={styles.qrLabel}>Your QR Code:</Text>
        <TouchableOpacity onPress={showQRCode} style={styles.qrWrapper}>
          <QRCode
            value={userId}
            size={150}
            color="black"
            backgroundColor="white"
          />
        </TouchableOpacity>
        <Text style={styles.qrHint}>Tap to enlarge</Text>
      </View>

      <TouchableOpacity style={styles.requestButton} onPress={handleRequestMoney}>
        <Text style={styles.requestButtonText}>Request Money</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Share your ID or QR code with others to receive money, or request money from specific users.
      </Text>

      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Money</Text>

            <TextInput
              style={styles.input}
              placeholder="Target User ID/Email/Phone"
              placeholderTextColor="#999"
              value={targetUser}
              onChangeText={setTargetUser}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount to Request"
              placeholderTextColor="#999"
              value={requestAmount}
              onChangeText={setRequestAmount}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Optional Message"
              placeholderTextColor="#999"
              value={requestMessage}
              onChangeText={setRequestMessage}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitMoneyRequest}
              >
                <Text style={styles.submitButtonText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  idContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  qrContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  qrLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  qrHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  requestButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReceiveMoneyScreen;