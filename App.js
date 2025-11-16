import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider, useAppContext } from './context/AppContext';

import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import ReceiveMoneyScreen from './screens/ReceiveMoneyScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SupportScreen from './screens/SupportScreen';
import ScanQRCodeScreen from './screens/ScanQRCodeScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, isLoading } = useAppContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 18, color: '#333' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Dashboard" : "Home"}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login / Sign Up' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ title: 'Send Money' }} />
        <Stack.Screen name="ScanQRCode" component={ScanQRCodeScreen} options={{ title: 'Scan QR Code' }} />
        <Stack.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} options={{ title: 'Receive Money' }} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ title: 'Transaction History' }} />
        <Stack.Screen name="Support" component={SupportScreen} options={{ title: 'Support' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
