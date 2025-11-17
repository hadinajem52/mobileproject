import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const TransactionHistoryScreen = ({ navigation }) => {
  const { user, getUserTransactions, findUserById } = useAppContext();

  const transactions = getUserTransactions(user?.id || '').map(txn => {
    const isSent = txn.senderId === user?.id;
    const otherUserId = isSent ? txn.recipientId : txn.senderId;
    const otherUser = findUserById(otherUserId);

    return {
      id: txn.id,
      type: isSent ? 'Sent' : 'Received',
      amount: isSent ? -txn.amount : txn.amount,
      recipient: isSent ? otherUser?.name : null,
      sender: !isSent ? otherUser?.name : null,
      date: new Date(txn.date).toISOString().split('T')[0],
      status: txn.status,
    };
  });

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>
          {item.type} ${Math.abs(item.amount)}
        </Text>
        <Text style={styles.transactionSubtext}>
          {item.type === 'Sent' ? `To: ${item.recipient}` : `From: ${item.sender}`}
        </Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.status, item.status === 'Completed' ? styles.completed : styles.pending]}>
        {item.status}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#007bff" />
      </TouchableOpacity>
      <Text style={styles.title}>Transaction History</Text>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Sent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Received</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
      />
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
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 3,
  },
  completed: {
    backgroundColor: '#28a745',
    color: '#fff',
  },
  pending: {
    backgroundColor: '#ffc107',
    color: '#000',
  },
});

export default TransactionHistoryScreen;