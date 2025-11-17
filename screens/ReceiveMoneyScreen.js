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
  Share,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';

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

  const shareId = async () => {
    try {
      await Share.share({ message: `My payment ID: ${userId}` });
    } catch (error) {
      Alert.alert('Error', 'Failed to share ID.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Receive Money</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>${user.balance.toFixed(2)}</Text>
          </View>
        </View>

        <Card style={styles.idCard}>
          <Text style={styles.sectionTitle}>Your Unique ID</Text>
          <Text style={styles.userId}>{userId}</Text>
          <View style={styles.copyShareButtons}>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={16} color="#1e1f1e" />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.copyButton, styles.shareButton]} onPress={shareId}>
              <Ionicons name="share-outline" size={16} color="#1e1f1e" />
              <Text style={styles.copyButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.qrCard}>
          <Text style={styles.sectionTitle}>Your QR Code</Text>
          <TouchableOpacity onPress={showQRCode} style={styles.qrWrapper}>
            <QRCode
              value={userId}
              size={150}
              color="black"
              backgroundColor="white"
            />
          </TouchableOpacity>
          <Text style={styles.qrHint}>Tap to enlarge</Text>
          <Text style={styles.qrNote}>Tip: Show this QR code on your device screen; the payer must scan it using their app's camera (screenshots or images are not supported for scanning).</Text>
        </Card>

        <TouchableOpacity style={styles.requestButton} onPress={handleRequestMoney}>
          <Ionicons name="send-outline" size={20} color="#1e1f1e" />
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
  idCard: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontFamily: 'StackSansHeadline-Medium',
    marginBottom: 12,
  },
  userId: {
    fontSize: 18,
    color: '#00ea00ff',
    marginBottom: 15,
    fontFamily: 'StackSansHeadline-Bold',
    textAlign: 'center',
  },
  copyShareButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  copyButton: {
    backgroundColor: '#00ea00ff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 8,
  },
  copyButtonText: {
    color: '#1e1f1e',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Medium',
    marginLeft: 6,
  },
  shareButton: {
    // No additional styles needed
  },
  qrCard: {
    marginHorizontal: 20,
    marginTop: 16,
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: '#2a2b2a',
    borderRadius: 10,
    alignSelf: 'center',
  },
  qrHint: {
    fontSize: 14,
    color: '#888888',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-Light',
  },
  qrNote: {
    fontSize: 13,
    color: '#aaaaaa',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-Regular',
  },
  requestButton: {
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
  requestButtonText: {
    color: '#1e1f1e',
    fontSize: 18,
    fontFamily: 'StackSansHeadline-Medium',
    marginLeft: 8,
  },
  note: {
    textAlign: 'center',
    color: '#cccccc',
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 20,
    fontFamily: 'StackSansHeadline-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2a2b2a',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#2a2b2a',
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
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
    backgroundColor: '#666666',
  },
  cancelButtonText: {
    color: '#cccccc',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Medium',
  },
  submitButton: {
    backgroundColor: '#00ea00ff',
  },
  submitButtonText: {
    color: '#1e1f1e',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default ReceiveMoneyScreen;