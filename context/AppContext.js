import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]); // Array of logged-in user objects
  const [activeAccountId, setActiveAccountId] = useState(null); // ID of current active account
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [moneyRequests, setMoneyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Sync accounts with latest data from registeredUsers
  useEffect(() => {
    if (accounts.length > 0 && registeredUsers.length > 0) {
      const updatedAccounts = accounts.map(account => {
        const latestData = registeredUsers.find(u => u.id === account.id);
        return latestData || account;
      });
      
      // Check if any account data changed
      const hasChanges = updatedAccounts.some((acc, index) => 
        JSON.stringify(acc) !== JSON.stringify(accounts[index])
      );
      
      if (hasChanges) {
        setAccounts(updatedAccounts);
        
        // Update current user if active
        if (activeAccountId) {
          const activeAccount = updatedAccounts.find(acc => acc.id === activeAccountId);
          if (activeAccount && JSON.stringify(activeAccount) !== JSON.stringify(user)) {
            setUser(activeAccount);
          }
        }
      }
    }
  }, [registeredUsers]);

  const loadData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const accountsData = await AsyncStorage.getItem('accounts');
      const activeAccountIdData = await AsyncStorage.getItem('activeAccountId');
      const usersData = await AsyncStorage.getItem('registeredUsers');
      const transactionsData = await AsyncStorage.getItem('allTransactions');
      const requestsData = await AsyncStorage.getItem('moneyRequests');
      
      if (accountsData) {
        const parsedAccounts = JSON.parse(accountsData);
        setAccounts(parsedAccounts);
        
        // Set active account
        if (activeAccountIdData) {
          const activeId = JSON.parse(activeAccountIdData);
          setActiveAccountId(activeId);
          const activeAccount = parsedAccounts.find(acc => acc.id === activeId);
          if (activeAccount) {
            setUser(activeAccount);
          }
        } else if (parsedAccounts.length > 0) {
          // If no active account set, use the first one
          setUser(parsedAccounts[0]);
          setActiveAccountId(parsedAccounts[0].id);
        }
      } else if (userData) {
        // Migration: if old single user exists, migrate to accounts array
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setAccounts([parsedUser]);
        setActiveAccountId(parsedUser.id);
      }
      
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
      await AsyncStorage.setItem('accounts', JSON.stringify(accounts));
      if (activeAccountId) {
        await AsyncStorage.setItem('activeAccountId', JSON.stringify(activeAccountId));
      }
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
    // Save data asynchronously after state update
    setTimeout(() => {
      AsyncStorage.setItem('registeredUsers', JSON.stringify(newUsers));
    }, 0);
    return newUser;
  };

  const login = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Check if account is already logged in
      const existingAccount = accounts.find(acc => acc.id === foundUser.id);
      if (!existingAccount) {
        // Add to accounts array
        const newAccounts = [...accounts, foundUser];
        setAccounts(newAccounts);
        setActiveAccountId(foundUser.id);
        setUser(foundUser);
        // Save data asynchronously after state update
        setTimeout(() => {
          AsyncStorage.setItem('accounts', JSON.stringify(newAccounts));
          AsyncStorage.setItem('activeAccountId', JSON.stringify(foundUser.id));
        }, 0);
      } else {
        // Just switch to existing account
        setActiveAccountId(foundUser.id);
        setUser(foundUser);
        setTimeout(() => {
          AsyncStorage.setItem('activeAccountId', JSON.stringify(foundUser.id));
        }, 0);
      }
      return true;
    }
    return false;
  };

  const addAccount = (email, password) => {
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      // Check if account is already logged in
      const existingAccount = accounts.find(acc => acc.id === foundUser.id);
      if (existingAccount) {
        return { success: false, message: 'Account is already added' };
      }
      
      // Add to accounts array
      const newAccounts = [...accounts, foundUser];
      setAccounts(newAccounts);
      setActiveAccountId(foundUser.id);
      setUser(foundUser);
      // Save data asynchronously after state update
      setTimeout(() => {
        AsyncStorage.setItem('accounts', JSON.stringify(newAccounts));
        AsyncStorage.setItem('activeAccountId', JSON.stringify(foundUser.id));
      }, 0);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const switchAccount = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      // Get the latest data for the account from registeredUsers
      const latestAccountData = registeredUsers.find(u => u.id === accountId);
      if (latestAccountData) {
        // Update the account in accounts array with latest data
        const updatedAccounts = accounts.map(acc => 
          acc.id === accountId ? latestAccountData : acc
        );
        setAccounts(updatedAccounts);
        setUser(latestAccountData);
        setActiveAccountId(accountId);
        setTimeout(() => {
          AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
          AsyncStorage.setItem('activeAccountId', JSON.stringify(accountId));
        }, 0);
        return true;
      }
      setUser(account);
      setActiveAccountId(accountId);
      setTimeout(() => {
        AsyncStorage.setItem('activeAccountId', JSON.stringify(accountId));
      }, 0);
      return true;
    }
    return false;
  };

  const removeAccount = (accountId) => {
    const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
    setAccounts(updatedAccounts);
    
    if (activeAccountId === accountId) {
      // If removing active account, switch to another or logout
      if (updatedAccounts.length > 0) {
        const newActiveAccount = updatedAccounts[0];
        setUser(newActiveAccount);
        setActiveAccountId(newActiveAccount.id);
        setTimeout(() => {
          AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
          AsyncStorage.setItem('activeAccountId', JSON.stringify(newActiveAccount.id));
        }, 0);
      } else {
        setUser(null);
        setActiveAccountId(null);
        setTimeout(() => {
          AsyncStorage.setItem('accounts', JSON.stringify([]));
          AsyncStorage.removeItem('activeAccountId');
        }, 0);
      }
    } else {
      setTimeout(() => {
        AsyncStorage.setItem('accounts', JSON.stringify(updatedAccounts));
      }, 0);
    }
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
    const trimmedRecipientId = recipientIdentifier.trim();
    const recipient = findUserById(trimmedRecipientId);

    if (!recipient) {
      console.log('Recipient not found:', trimmedRecipientId);
      console.log('Available users:', registeredUsers.map(u => ({ id: u.id, name: u.name })));
      return { success: false, message: 'Recipient not found. Sending is only allowed using the recipient\'s unique ID (scan their QR).' };
    }

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
    setAccounts([]);
    setActiveAccountId(null);
    AsyncStorage.removeItem('user');
    AsyncStorage.removeItem('accounts');
    AsyncStorage.removeItem('activeAccountId');
  };

  const logoutAccount = (accountId) => {
    removeAccount(accountId);
  };

  return (
    <AppContext.Provider value={{
      user,
      accounts,
      activeAccountId,
      registeredUsers,
      allTransactions,
      moneyRequests,
      isLoading,
      registerUser,
      login,
      addAccount,
      switchAccount,
      removeAccount,
      logoutAccount,
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