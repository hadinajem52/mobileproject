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

const PendingRequestsScreen = ({ navigation }) => {
  const { user, getPendingRequests, findUserById, acceptMoneyRequest, rejectMoneyRequest } = useAppContext();

  const pendingRequests = getPendingRequests(user?.id || '');

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

  const renderRequestItem = ({ item }) => {
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pending Money Requests</Text>
        {pendingRequests.length > 0 ? (
          <FlatList
            data={pendingRequests}
            keyExtractor={(item) => item.id}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noRequestsText}>No pending requests</Text>
        )}
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
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noRequestsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  requestItem: {
    backgroundColor: '#fff',
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
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  rejectButton: {
    backgroundColor: '#f44336',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PendingRequestsScreen;