import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const securityQuestions = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favorite color?",
  "What was your childhood nickname?"
];

const AuthScreen = ({ navigation, route }) => {
  const { registerUser, login, addAccount, verifySecurityAnswers, updatePassword, getSecurityQuestion } = useAppContext();
  const isAddingAccount = route?.params?.isAddingAccount || false;
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState(0);
  const [recoveryUser, setRecoveryUser] = useState(null);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [securityQ, setSecurityQ] = useState(securityQuestions[0]);
  const [answer, setAnswer] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleAuth = () => {
    if (isRecovering) {
      handlePasswordRecovery();
      return;
    }

    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    const trimmedEmail = email.trim();
    
    if (isAddingAccount) {
      // Adding account mode
      const result = addAccount(trimmedEmail, password);
      if (result.success) {
        Alert.alert('Success', 'Account added successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', result.message);
      }
    } else {
      // Normal login mode
      const success = login(trimmedEmail, password);
      if (success) {
        // Navigation will happen automatically when user state changes
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    }
  };

  const handleSignup = () => {
    if (!name || !email || !phone || !password || !confirmPassword || !answer) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const userData = {
      name,
      email: email.trim(),
      phone,
      password,
      securityQuestion: securityQ,
      securityAnswer: answer,
    };

    registerUser(userData);
    Alert.alert('Success', 'Account created successfully! Please login.');
    setIsLogin(true);
    // Keep email and password so user can login immediately
    // setEmail('');
    // setPassword('');
    setName('');
    setPhone('');
    setSecurityQ(securityQuestions[0]);
    setAnswer('');
    setConfirmPassword('');
  };

  const handlePasswordRecovery = () => {
    if (recoveryStep === 0) {
      if (!email) {
        Alert.alert('Error', 'Please enter email');
        return;
      }
      const question = getSecurityQuestion(email.trim());
      if (!question) {
        Alert.alert('Error', 'Email not found');
        return;
      }
      setRecoveryUser({ email: email.trim(), question });
      setRecoveryStep(1);
    } else if (recoveryStep === 1) {
      if (!recoveryAnswer) {
        Alert.alert('Error', 'Please answer the question');
        return;
      }
      const verified = verifySecurityAnswers(recoveryUser.email, recoveryAnswer);
      if (verified) {
        setRecoveryStep(2);
      } else {
        Alert.alert('Error', 'Incorrect answer');
      }
    } else if (recoveryStep === 2) {
      if (!newPassword || !confirmNewPassword) {
        Alert.alert('Error', 'Please enter new password');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      const success = updatePassword(recoveryUser.email, newPassword);
      if (success) {
        Alert.alert('Success', 'Password updated successfully! Please login.');
        setIsRecovering(false);
        setRecoveryStep(0);
        setRecoveryUser(null);
        setRecoveryAnswer('');
        setNewPassword('');
        setConfirmNewPassword('');
        setEmail('');
      } else {
        Alert.alert('Error', 'Failed to update password');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsRecovering(false);
    setRecoveryStep(0);
    setRecoveryUser(null);
    setRecoveryAnswer('');
    setNewPassword('');
    setConfirmNewPassword('');
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setSecurityQ(securityQuestions[0]);
    setAnswer('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {(isAddingAccount || (!isLogin && !isRecovering)) && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => isAddingAccount ? navigation.goBack() : toggleMode()}
          >
            <Ionicons name="chevron-back" size={24} color="#00ea00ff" />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>
          {isAddingAccount 
            ? 'Add Account' 
            : isRecovering 
              ? (recoveryStep === 0 ? 'Password Recovery - Enter Email' : recoveryStep === 1 ? 'Password Recovery - Answer Question' : 'Password Recovery - Set New Password') 
              : isLogin ? 'Login' : 'Sign Up'}
        </Text>

        {isAddingAccount && isLogin && (
          <Text style={styles.subtitle}>
            Log in to another account to switch between them seamlessly.
          </Text>
        )}

      {!isRecovering && (
        <>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {!isLogin && (
            <>
              <Text style={styles.label}>Security Question</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={securityQ}
                  onValueChange={(itemValue) => setSecurityQ(itemValue)}
                  style={styles.picker}
                >
                  {securityQuestions.map((q, index) => (
                    <Picker.Item key={index} label={q} value={q} />
                  ))}
                </Picker>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Answer"
                placeholderTextColor="#999"
                value={answer}
                onChangeText={setAnswer}
              />
              <TextInput
                style={styles.input}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          )}

          {isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          )}
        </>
      )}

      {isRecovering && (
        <>
          {recoveryStep === 0 && (
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
          {recoveryStep === 1 && recoveryUser && (
            <>
              <Text style={styles.label}>{recoveryUser.question}</Text>
              <TextInput
                style={styles.input}
                placeholder="Your Answer"
                placeholderTextColor="#999"
                value={recoveryAnswer}
                onChangeText={setRecoveryAnswer}
              />
            </>
          )}
          {recoveryStep === 2 && (
            <>
              <TextInput
                style={styles.input}
                placeholder="New Password (min 6 characters)"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                placeholderTextColor="#999"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                secureTextEntry
              />
            </>
          )}
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRecovering ? (recoveryStep === 0 ? 'Next' : recoveryStep === 1 ? 'Verify Answer' : 'Update Password') : isLogin ? (isAddingAccount ? 'Add Account' : 'Login') : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {!isRecovering && !isAddingAccount && (
        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      )}

      {isLogin && !isRecovering && !isAddingAccount && (
        <TouchableOpacity onPress={() => setIsRecovering(true)}>
          <Text style={styles.recoverText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      {isRecovering && (
        <TouchableOpacity onPress={() => {
          if (recoveryStep > 0) {
            setRecoveryStep(recoveryStep - 1);
          } else {
            setIsRecovering(false);
            setRecoveryStep(0);
            setRecoveryUser(null);
            setRecoveryAnswer('');
            setNewPassword('');
            setConfirmNewPassword('');
          }
        }}>
          <Text style={styles.recoverText}>{recoveryStep === 0 ? 'Back to Login' : 'Back'}</Text>
        </TouchableOpacity>
      )}
      </ScrollView>
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#00ea00ff',
    fontFamily: 'StackSansHeadline-SemiBold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#cccccc',
    paddingHorizontal: 20,
    fontFamily: 'StackSansHeadline-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#2a2b2a',
    fontSize: 16,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Regular',
  },
  button: {
    backgroundColor: '#00ea00ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#1e1f1e',
    fontSize: 18,
    fontFamily: 'StackSansHeadline-Medium',
  },
  switchText: {
    textAlign: 'center',
    color: '#00ea00ff',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'StackSansHeadline-Regular',
  },
  recoverText: {
    textAlign: 'center',
    color: '#ff4444',
    fontSize: 16,
    fontFamily: 'StackSansHeadline-Regular',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#cccccc',
    fontFamily: 'StackSansHeadline-Medium',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 5,
    backgroundColor: '#2a2b2a',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default AuthScreen;