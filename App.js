import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppProvider, useAppContext } from './context/AppContext';

import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import ReceiveMoneyScreen from './screens/ReceiveMoneyScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SupportScreen from './screens/SupportScreen';
import ScanQRCodeScreen from './screens/ScanQRCodeScreen';
import AccountScreen from './screens/AccountScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ddd',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="SendMoney" 
        component={SendMoneyScreen}
        options={{
          tabBarLabel: 'Send',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="send" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="ReceiveMoney" 
        component={ReceiveMoneyScreen}
        options={{
          tabBarLabel: 'Receive',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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
              name="MainTabs" 
              component={MainTabNavigator} 
            />
            <Stack.Screen 
              name="ScanQRCode" 
              component={ScanQRCodeScreen} 
            />
            <Stack.Screen 
              name="TransactionHistory" 
              component={TransactionHistoryScreen} 
            />
            <Stack.Screen 
              name="Support" 
              component={SupportScreen} 
            />
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen} 
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
