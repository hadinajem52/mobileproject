import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

const DashboardScreen = ({ navigation }) => {
  const { user, getUserTransactions, findUserById, getPendingRequests, acceptMoneyRequest, rejectMoneyRequest, logout } = useAppContext();

  const balance = user?.balance || 0;
  const allUserTransactions = getUserTransactions(user?.id || '');
  const pendingRequests = getPendingRequests(user?.id || '');

  const recentTransactions = allUserTransactions.slice(0, 5).map(txn => {
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
    };
  });

  const handleAcceptRequest = (requestId) => {
    const result = acceptMoneyRequest(requestId);
    if (result.success) {
      Alert.alert('Success', 'Money request accepted and payment sent!');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleRejectRequest = (requestId) => {
    rejectMoneyRequest(requestId);
    Alert.alert('Request Rejected', 'The money request has been rejected.');
  };

  const handleLogout = () => {
    logout();
    // Navigation will happen automatically when user state changes
    // No need to manually navigate
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>
        {item.type} ${Math.abs(item.amount)} {item.type === 'Sent' ? `to ${item.recipient}` : `from ${item.sender}`}
      </Text>
      <Text style={styles.transactionDate}>{item.date}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SendMoney')}
        >
          <Text style={styles.actionButtonText}>Send Money</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ReceiveMoney')}
        >
          <Text style={styles.actionButtonText}>Receive Money</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <Text style={styles.actionButtonText}>History</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Pending Money Requests</Text>
      {pendingRequests.length > 0 ? (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const requester = findUserById(item.requesterId);
            return (
              <View style={styles.requestItem}>
                <Text style={styles.requestText}>
                  {requester?.name} requested ${item.amount}
                </Text>
                <Text style={styles.requestNote}>{item.message}</Text>
                <View style={styles.requestButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAcceptRequest(item.id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleRejectRequest(item.id)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      ) : (
        <Text style={styles.noRequestsText}>No pending requests</Text>
      )}

      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList
        data={recentTransactions}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
  },
  transactionText: {
    fontSize: 16,
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  noRequestsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  requestItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  requestText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requestNote: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginRight: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#f44336',
    flex: 1,
    marginLeft: 5,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;