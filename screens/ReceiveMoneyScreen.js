import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const ReceiveMoneyScreen = ({ navigation }) => {
  const userId = 'USER123456'; // Mock user ID

  const handleRequestMoney = () => {
    Alert.alert('Request Sent', 'Money request sent to selected contacts');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive Money</Text>
      <View style={styles.idContainer}>
        <Text style={styles.label}>Your Unique ID:</Text>
        <Text style={styles.userId}>{userId}</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.qrButton}>
        <Text style={styles.qrButtonText}>Show QR Code</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.requestButton} onPress={handleRequestMoney}>
        <Text style={styles.requestButtonText}>Request Money</Text>
      </TouchableOpacity>
      <Text style={styles.note}>
        Share your ID or QR code with others to receive money.
      </Text>
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
    fontSize: 24,
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
  qrButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 18,
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
});

export default ReceiveMoneyScreen;