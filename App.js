import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {!user ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
            />
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen} 
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
            />
            <Stack.Screen 
              name="SendMoney" 
              component={SendMoneyScreen} 
            />
            <Stack.Screen 
              name="ScanQRCode" 
              component={ScanQRCodeScreen} 
            />
            <Stack.Screen 
              name="ReceiveMoney" 
              component={ReceiveMoneyScreen} 
            />
            <Stack.Screen 
              name="TransactionHistory" 
              component={TransactionHistoryScreen} 
            />
            <Stack.Screen 
              name="Support" 
              component={SupportScreen} 
            />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
