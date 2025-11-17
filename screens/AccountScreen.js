import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const AccountScreen = ({ navigation }) => {
  const { user, accounts, switchAccount, logoutAccount, logout } = useAppContext();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of all accounts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ]
    );
  };

  const handleLogoutAccount = (accountId, accountName) => {
    Alert.alert(
      'Logout Account',
      `Are you sure you want to log out of ${accountName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logoutAccount(accountId);
            setShowAccountSwitcher(false);
          },
        },
      ]
    );
  };

  const handleSwitchAccount = (accountId) => {
    switchAccount(accountId);
    setShowAccountSwitcher(false);
  };

  const handleAddAccount = () => {
    setShowAccountSwitcher(false);
    navigation.navigate('Auth', { isAddingAccount: true });
  };

  const handleSupport = () => {
    navigation.navigate('Support');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Account</Text>
        
        {/* Current User Info */}
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => setShowAccountSwitcher(true)}
        >
          <View style={styles.userInfoLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>
          </View>
          {accounts.length > 1 && (
            <Ionicons name="chevron-down" size={24} color="#666" />
          )}
        </TouchableOpacity>

        {/* Add Account Button (if only one account) */}
        {accounts.length === 1 && (
          <TouchableOpacity 
            style={styles.addAccountButton}
            onPress={handleAddAccount}
          >
            <Ionicons name="add-circle-outline" size={24} color="#007bff" />
            <Text style={styles.addAccountText}>Add Another Account</Text>
          </TouchableOpacity>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleSupport}>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
            <Text style={styles.optionText}>Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout All Accounts</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Account Switcher Modal */}
      <Modal
        visible={showAccountSwitcher}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAccountSwitcher(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowAccountSwitcher(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Account</Text>
              <TouchableOpacity
                onPress={() => setShowAccountSwitcher(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.accountsList}>
              {accounts.map((account) => (
                <View key={account.id} style={styles.accountItem}>
                  <TouchableOpacity
                    style={styles.accountItemButton}
                    onPress={() => handleSwitchAccount(account.id)}
                  >
                    <View style={styles.accountItemLeft}>
                      <View style={[
                        styles.accountAvatar,
                        account.id === user?.id && styles.accountAvatarActive
                      ]}>
                        <Text style={styles.accountAvatarText}>
                          {account.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.accountName}>{account.name}</Text>
                        <Text style={styles.accountEmail}>{account.email}</Text>
                      </View>
                    </View>
                    {account.id === user?.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#007bff" />
                    )}
                  </TouchableOpacity>
                  
                  {accounts.length > 1 && (
                    <TouchableOpacity
                      style={styles.logoutAccountButton}
                      onPress={() => handleLogoutAccount(account.id, account.name)}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#dc3545" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Add Account Button in Modal */}
              <TouchableOpacity
                style={styles.addAccountButtonModal}
                onPress={handleAddAccount}
              >
                <Ionicons name="add-circle" size={24} color="#007bff" />
                <Text style={styles.addAccountTextModal}>Add Account</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontFamily: 'StackSansHeadline-Bold',
  },
  userName: {
    fontSize: 18,
    color: '#333',
    marginBottom: 2,
    fontFamily: 'StackSansHeadline-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'StackSansHeadline-Regular',
  },
  addAccountButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addAccountText: {
    color: '#007bff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlayTouch: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  modalCloseButton: {
    padding: 5,
  },
  accountsList: {
    padding: 15,
  },
  accountItem: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  accountItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountAvatarActive: {
    backgroundColor: '#007bff',
  },
  accountAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'StackSansHeadline-Bold',
  },
  accountName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
    fontFamily: 'StackSansHeadline-Medium',
  },
  accountEmail: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'StackSansHeadline-Regular',
  },
  logoutAccountButton: {
    position: 'absolute',
    right: 50,
    top: 15,
    padding: 8,
  },
  addAccountButtonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    marginTop: 10,
  },
  addAccountTextModal: {
    color: '#007bff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default AccountScreen;