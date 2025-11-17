import React, { useState } from 'react';
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
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const allTransactions = getUserTransactions(user?.id || '').map(txn => {
    const isSent = txn.senderId === user?.id;
    const otherUserId = isSent ? txn.recipientId : txn.senderId;
    const otherUser = findUserById(otherUserId);

    return {
      id: txn.id,
      type: isSent ? 'Sent' : 'Received',
      amount: isSent ? -txn.amount : txn.amount,
      recipient: isSent ? otherUser?.name : null,
      sender: !isSent ? otherUser?.name : null,
      date: new Date(txn.date),
      status: txn.status,
    };
  });

  const getFilteredTransactions = () => {
    let filtered = allTransactions;

    // Type filter
    if (typeFilter !== 'All') {
      filtered = filtered.filter(txn => txn.type === typeFilter);
    }

    // Date filter
    const now = new Date();
    if (dateFilter === 'Last 7 days') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(txn => txn.date >= sevenDaysAgo);
    } else if (dateFilter === 'Last 30 days') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(txn => txn.date >= thirtyDaysAgo);
    }

    return filtered.sort((a, b) => b.date - a.date); // Sort by date descending
  };

  const transactions = getFilteredTransactions();

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionText}>
          {item.type} ${Math.abs(item.amount)}
        </Text>
        <Text style={styles.transactionSubtext}>
          {item.type === 'Sent' ? `To: ${item.recipient}` : `From: ${item.sender}`}
        </Text>
        <Text style={styles.transactionDate}>{item.date.toLocaleDateString()}</Text>
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
        <Text style={styles.filterTitle}>Type:</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterButton, typeFilter === 'All' && styles.filterButtonActive]} 
            onPress={() => setTypeFilter('All')}
          >
            <Text style={[styles.filterButtonText, typeFilter === 'All' && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, typeFilter === 'Sent' && styles.filterButtonActive]} 
            onPress={() => setTypeFilter('Sent')}
          >
            <Text style={[styles.filterButtonText, typeFilter === 'Sent' && styles.filterButtonTextActive]}>Sent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, typeFilter === 'Received' && styles.filterButtonActive]} 
            onPress={() => setTypeFilter('Received')}
          >
            <Text style={[styles.filterButtonText, typeFilter === 'Received' && styles.filterButtonTextActive]}>Received</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.filterTitle}>Date:</Text>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[styles.filterButton, dateFilter === 'All' && styles.filterButtonActive]} 
            onPress={() => setDateFilter('All')}
          >
            <Text style={[styles.filterButtonText, dateFilter === 'All' && styles.filterButtonTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, dateFilter === 'Last 7 days' && styles.filterButtonActive]} 
            onPress={() => setDateFilter('Last 7 days')}
          >
            <Text style={[styles.filterButtonText, dateFilter === 'Last 7 days' && styles.filterButtonTextActive]}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, dateFilter === 'Last 30 days' && styles.filterButtonActive]} 
            onPress={() => setDateFilter('Last 30 days')}
          >
            <Text style={[styles.filterButtonText, dateFilter === 'Last 30 days' && styles.filterButtonTextActive]}>30 Days</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cccccc',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  filterButton: {
    backgroundColor: '#2a2b2a',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#00ea00ff',
  },
  filterButtonText: {
    color: '#cccccc',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#1e1f1e',
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