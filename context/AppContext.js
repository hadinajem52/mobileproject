import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(1500.00);
  const [transactions, setTransactions] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const balanceData = await AsyncStorage.getItem('balance');
      const transactionsData = await AsyncStorage.getItem('transactions');
      const usersData = await AsyncStorage.getItem('registeredUsers');
      if (userData) setUser(JSON.parse(userData));
      if (balanceData) setBalance(parseFloat(balanceData));
      if (transactionsData) setTransactions(JSON.parse(transactionsData));
      if (usersData) setRegisteredUsers(JSON.parse(usersData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      if (user) await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('balance', balance.toString());
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const registerUser = (userData) => {
    const newUsers = [...registeredUsers, userData];
    setRegisteredUsers(newUsers);
    saveData();
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

  const recoverPassword = (email, securityAnswer) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.securityAnswer === securityAnswer);
    if (foundUser) {
      return foundUser.password;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    setBalance(1500.00);
    setTransactions([]);
    AsyncStorage.clear();
  };

  const addTransaction = (transaction) => {
    const newTransactions = [transaction, ...transactions];
    setTransactions(newTransactions);
    if (transaction.amount > 0) {
      setBalance(balance + transaction.amount);
    } else {
      setBalance(balance + transaction.amount); // amount is negative for sent
    }
    saveData();
  };

  return (
    <AppContext.Provider value={{
      user,
      balance,
      transactions,
      registeredUsers,
      registerUser,
      login,
      recoverPassword,
      logout,
      addTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
};