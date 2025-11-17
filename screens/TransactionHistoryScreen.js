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
        <Ionicons name="arrow-back" size={28} color="#00ea00ff" />
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        }
      />
      </View>
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
    padding: 20,
    backgroundColor: '#1e1f1e',
  },
  backButton: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#00ea00ff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#00ea00ff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#1e1f1e',
    fontSize: 16,
  },
  transactionsList: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#2a2b2a',
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
    color: '#cccccc',
  },
  transactionSubtext: {
    fontSize: 14,
    color: '#888888',
    marginTop: 5,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 3,
  },
  completed: {
    backgroundColor: '#00ea00ff',
    color: '#1e1f1e',
  },
  pending: {
    backgroundColor: '#ffff00',
    color: '#1e1f1e',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
  },
});

export default TransactionHistoryScreen;