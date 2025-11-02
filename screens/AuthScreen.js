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
import { useAppContext } from '../context/AppContext';

const AuthScreen = ({ navigation }) => {
  const { registerUser, login, recoverPassword } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovering, setIsRecovering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    const success = login(trimmedEmail, password);
    if (success) {
      navigation.replace('Dashboard');
    } else {
      Alert.alert('Error', 'Invalid email or password');
    }
  };

  const handleSignup = () => {
    if (!name || !email || !phone || !password || !confirmPassword || !securityQuestion || !securityAnswer) {
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
      securityQuestion,
      securityAnswer,
    };

    registerUser(userData);
    Alert.alert('Success', 'Account created successfully! Please login.');
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setConfirmPassword('');
  };

  const handlePasswordRecovery = () => {
    if (!email || !securityAnswer) {
      Alert.alert('Error', 'Please enter email and security answer');
      return;
    }

    const trimmedEmail = email.trim();
    const recoveredPassword = recoverPassword(trimmedEmail, securityAnswer);
    if (recoveredPassword) {
      Alert.alert('Password Recovered', `Your password is: ${recoveredPassword}`);
      setIsRecovering(false);
      setEmail('');
      setSecurityAnswer('');
    } else {
      Alert.alert('Error', 'Invalid email or security answer');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsRecovering(false);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    setConfirmPassword('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {isRecovering ? 'Password Recovery' : isLogin ? 'Login' : 'Sign Up'}
      </Text>

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
              <TextInput
                style={styles.input}
                placeholder="Security Question (e.g., What is your pet's name?)"
                placeholderTextColor="#999"
                value={securityQuestion}
                onChangeText={setSecurityQuestion}
              />
              <TextInput
                style={styles.input}
                placeholder="Security Answer"
                placeholderTextColor="#999"
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
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
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Security Answer"
            placeholderTextColor="#999"
            value={securityAnswer}
            onChangeText={setSecurityAnswer}
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRecovering ? 'Recover Password' : isLogin ? 'Login' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      {!isRecovering && (
        <TouchableOpacity onPress={toggleMode}>
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      )}

      {isLogin && !isRecovering && (
        <TouchableOpacity onPress={() => setIsRecovering(true)}>
          <Text style={styles.recoverText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      {isRecovering && (
        <TouchableOpacity onPress={() => setIsRecovering(false)}>
          <Text style={styles.recoverText}>Back to Login</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: 16,
    marginBottom: 10,
  },
  recoverText: {
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 16,
  },
});

export default AuthScreen;