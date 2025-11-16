import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const transactionsData = await AsyncStorage.getItem('allTransactions');
      const requestsData = await AsyncStorage.getItem('moneyRequests');
      if (userData) setUser(JSON.parse(userData));
      if (usersData) setRegisteredUsers(JSON.parse(usersData));
      if (transactionsData) setAllTransactions(JSON.parse(transactionsData));
      if (requestsData) setMoneyRequests(JSON.parse(requestsData));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      if (user) await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      await AsyncStorage.setItem('allTransactions', JSON.stringify(allTransactions));
      await AsyncStorage.setItem('moneyRequests', JSON.stringify(moneyRequests));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const generateUserId = () => {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const generateTransactionId = () => {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const registerUser = (userData) => {
    const newUser = {
      id: generateUserId(),
      ...userData,
      balance: 1000.00, // Starting balance
    };
    const newUsers = [...registeredUsers, newUser];
    setRegisteredUsers(newUsers);
    saveData();
    return newUser;
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      saveData();
      return true;
    }
    return false;
  };

  const verifySecurityAnswers = (email, answer) => {
    const foundUser = registeredUsers.find(u => u.email === email);
    if (!foundUser || !foundUser.securityQuestion || !foundUser.securityAnswer) return false;
    return foundUser.securityAnswer.toLowerCase() === answer.toLowerCase();
  };

  const updatePassword = (email, newPassword) => {
    const userIndex = registeredUsers.findIndex(u => u.email === email);
    if (userIndex !== -1) {
      registeredUsers[userIndex].password = newPassword;
      saveData();
      return true;
    }
    return false;
  };

  const getSecurityQuestion = (email) => {
    const foundUser = registeredUsers.find(u => u.email === email);
    return foundUser ? foundUser.securityQuestion : null;
  };

  const findUserById = (userId) => {
    return registeredUsers.find(u => u.id === userId);
  };

  const findUserByEmail = (email) => {
    return registeredUsers.find(u => u.email === email);
  };

  const findUserByPhone = (phone) => {
    return registeredUsers.find(u => u.phone === phone);
  };

  const sendMoney = (senderId, recipientIdentifier, amount, message = '') => {
    const sender = registeredUsers.find(u => u.id === senderId);
    if (!sender) return { success: false, message: 'Sender not found' };

    if (sender.balance < amount) return { success: false, message: 'Insufficient balance' };

  // Only allow sending by exact user ID (scan / copy of unique ID)
  const recipient = findUserById(recipientIdentifier);

  if (!recipient) return { success: false, message: 'Recipient not found. Sending is only allowed using the recipient\'s unique ID (scan their QR).' };

  if (sender.id === recipient.id) return { success: false, message: 'Cannot send money to yourself' };

    console.log('Sending money from:', sender.name, 'balance:', sender.balance, 'to:', recipient.name, 'balance:', recipient.balance, 'amount:', amount);

    // Create transaction
    const transaction = {
      id: generateTransactionId(),
      senderId: sender.id,
      recipientId: recipient.id,
      amount: amount,
      message: message,
      date: new Date().toISOString(),
      status: 'completed',
    };

    // Update balances
    const updatedUsers = registeredUsers.map(u => {
      if (u.id === sender.id) {
        return { ...u, balance: u.balance - amount };
      }
      if (u.id === recipient.id) {
        return { ...u, balance: u.balance + amount };
      }
      return u;
    });

    console.log('Updated users:', updatedUsers.map(u => ({ name: u.name, balance: u.balance })));

    setRegisteredUsers(updatedUsers);
    setAllTransactions([...allTransactions, transaction]);

    // Update current user if they are sender or recipient
    if (user && (user.id === sender.id || user.id === recipient.id)) {
      const updatedUser = updatedUsers.find(u => u.id === user.id);
      setUser(updatedUser);
      console.log('Updated current user balance:', updatedUser?.balance);
    }

    saveData();
    return { success: true, transaction };
  };

  const getUserTransactions = (userId) => {
    return allTransactions.filter(txn =>
      txn.senderId === userId || txn.recipientId === userId
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const requestMoney = (requesterId, targetIdentifier, amount, message = '') => {
    const requester = registeredUsers.find(u => u.id === requesterId);
    if (!requester) return { success: false, message: 'Requester not found' };

    // Find target by ID, email, or phone
    let target = findUserById(targetIdentifier) ||
                 findUserByEmail(targetIdentifier) ||
                 findUserByPhone(targetIdentifier);

    if (!target) return { success: false, message: 'Target user not found. You can only request money from registered users.' };

    if (requester.id === target.id) return { success: false, message: 'Cannot request money from yourself' };

    // Create money request
    const request = {
      id: generateTransactionId(),
      requesterId: requester.id,
      targetId: target.id,
      amount: amount,
      message: message,
      date: new Date().toISOString(),
      status: 'pending',
    };

    setMoneyRequests([...moneyRequests, request]);
    saveData();
    return { success: true, request };
  };

  const acceptMoneyRequest = (requestId) => {
    const request = moneyRequests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') {
      return { success: false, message: 'Request not found or already processed' };
    }

    console.log('Accepting request:', request);
    console.log('Target ID (sender):', request.targetId);
    console.log('Requester ID (recipient):', request.requesterId);

    // Use sendMoney to transfer the funds
    const result = sendMoney(request.targetId, request.requesterId, request.amount, `Payment for money request: ${request.message}`);

    console.log('Send money result:', result);

    if (result.success) {
      // Update request status
      const updatedRequests = moneyRequests.map(r =>
        r.id === requestId ? { ...r, status: 'accepted' } : r
      );
      setMoneyRequests(updatedRequests);
      saveData();
      return { success: true };
    }

    return result;
  };

  const rejectMoneyRequest = (requestId) => {
    const updatedRequests = moneyRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' } : r
    );
    setMoneyRequests(updatedRequests);
    saveData();
  };

  const getPendingRequests = (userId) => {
    return moneyRequests.filter(r => r.targetId === userId && r.status === 'pending');
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{
      user,
      registeredUsers,
      allTransactions,
      moneyRequests,
      isLoading,
      registerUser,
      login,
      verifySecurityAnswers,
      updatePassword,
      getSecurityQuestion,
      findUserById,
      findUserByEmail,
      findUserByPhone,
      sendMoney,
      requestMoney,
      acceptMoneyRequest,
      rejectMoneyRequest,
      getPendingRequests,
      getUserTransactions,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  );
};