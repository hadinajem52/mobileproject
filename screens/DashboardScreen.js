import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import SendMoneyModal from '../components/SendMoneyModal';
import ReceiveMoneyModal from '../components/ReceiveMoneyModal';

const DashboardScreen = ({ navigation }) => {
  const { user, getUserTransactions, findUserById, getPendingRequests, acceptMoneyRequest, rejectMoneyRequest } = useAppContext();
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

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
        <Text style={styles.title}>Welcome back, {user?.name || 'User'}!</Text>

        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="wallet" size={24} color="#2d2f30ff" />
            <Text style={styles.balanceLabel}>Total Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowSendModal(true)}>
              <Ionicons name="send" size={24} color="#000000ff" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowReceiveModal(true)}>
              <Ionicons name="download" size={24} color="#000000ff" />
              <Text style={styles.actionButtonText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('TransactionHistory')}>
              <Ionicons name="list" size={24} color="#000000ff" />
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {pendingRequests.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
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
          </Card>
        )}

        <Card style={styles.transactionsCard}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={recentTransactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Card>
      </View>

      <SendMoneyModal visible={showSendModal} onClose={() => setShowSendModal(false)} navigation={navigation} />
      <ReceiveMoneyModal visible={showReceiveModal} onClose={() => setShowReceiveModal(false)} />
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
    padding: 16,
    backgroundColor: '#1e1f1e',
  },
  title: {
    fontSize: 28,
    color: '#00ea00ff',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-Bold',
  },
  balanceCard: {
    backgroundColor: '#00ea00ff',
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#1e1f1e',
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  balanceAmount: {
    fontSize: 36,
    color: '#1e1f1e',
    fontFamily: 'StackSansHeadline-Bold',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#00ea00ff',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#1e1f1e',
    fontSize: 14,
    fontFamily: 'StackSansHeadline-Medium',
    marginTop: 4,
  },
  transactionsCard: {
    flex: 1,
  },
  transactionItem: {
    backgroundColor: '#2a2b2a',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionText: {
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
  },
  transactionDate: {
    fontSize: 14,
    color: '#888888',
    fontFamily: 'StackSansHeadline-Light',
  },
  requestItem: {
    backgroundColor: '#2a2b2a',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  requestText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 4,
    fontFamily: 'StackSansHeadline-Medium',
  },
  requestNote: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
    fontFamily: 'StackSansHeadline-Regular',
  },
  requestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#00ea00ff',
    marginRight: 4,
  },
  rejectButton: {
    backgroundColor: '#ff4444',
    marginLeft: 4,
  },
  buttonText: {
    color: '#1e1f1e',
    fontSize: 14,
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default DashboardScreen;