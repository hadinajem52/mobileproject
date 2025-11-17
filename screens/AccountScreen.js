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
            <Ionicons name="add-circle-outline" size={24} color="#00ea00ff" />
            <Text style={styles.addAccountText}>Add Another Account</Text>
          </TouchableOpacity>
        )}

        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleSupport}>
            <Ionicons name="help-circle-outline" size={24} color="#000000ff" />
            <Text style={styles.optionText}>Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.optionButton, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#000000ff" />
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
                <Ionicons name="close" size={24} color="#00ea00ff" />
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
                      <Ionicons name="checkmark-circle" size={24} color="#00ea00ff" />
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
                <Ionicons name="add-circle" size={24} color="#00ea00ff" />
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
    backgroundColor: '#1e1f1e',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1e1f1e',
  },
  title: {
    fontSize: 24,
    color: '#00ea00ff',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  userInfo: {
    backgroundColor: '#2a2b2a',
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
    backgroundColor: '#00ea00ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#1e1f1e',
    fontSize: 24,
    fontFamily: 'StackSansHeadline-Bold',
  },
  userName: {
    fontSize: 18,
    color: '#cccccc',
    marginBottom: 2,
    fontFamily: 'StackSansHeadline-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#888888',
    fontFamily: 'StackSansHeadline-Regular',
  },
  addAccountButton: {
    backgroundColor: '#2a2b2a',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addAccountText: {
    color: '#00ea00ff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#00ea00ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionText: {
    color: '#1e1f1e',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
  logoutText: {
    color: '#1e1f1e',
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
    backgroundColor: '#2a2b2a',
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
    borderBottomColor: '#333333',
  },
  modalTitle: {
    fontSize: 20,
    color: '#00ea00ff',
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
    backgroundColor: '#2a2b2a',
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
    backgroundColor: '#666666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountAvatarActive: {
    backgroundColor: '#00ea00ff',
  },
  accountAvatarText: {
    color: '#1e1f1e',
    fontSize: 20,
    fontFamily: 'StackSansHeadline-Bold',
  },
  accountName: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 2,
    fontFamily: 'StackSansHeadline-Medium',
  },
  accountEmail: {
    fontSize: 13,
    color: '#888888',
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
    backgroundColor: '#2a2b2a',
    borderRadius: 10,
    marginTop: 10,
  },
  addAccountTextModal: {
    color: '#00ea00ff',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'StackSansHeadline-Medium',
  },
});

export default AccountScreen;