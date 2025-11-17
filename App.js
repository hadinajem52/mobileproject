import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadAsync } from 'expo-font';
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
const Tab = createMaterialTopTabNavigator();

const customCardStyleInterpolator = ({ current, next, inverted, layouts }) => {
  const translateX = Animated.multiply(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      extrapolate: 'clamp',
    }),
    inverted
  );

  const opacity = current.progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return {
    cardStyle: {
      transform: [{ translateX }],
      opacity,
    },
  };
};

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={{
        tabBarActiveTintColor: '#00ff00',
        tabBarInactiveTintColor: '#cccccc',
        tabBarStyle: {
          backgroundColor: '#1e1f1e',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 70,
        },
        tabBarLabelStyle: {
          fontFamily: 'StackSansHeadline-Medium',
          fontSize: 12,
        },
        tabBarIndicatorStyle: {
          display: 'none',
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1f1e' }}>
        <Text style={{ fontSize: 18, color: '#00ea00ff', fontFamily: 'StackSansHeadline-Regular' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: customCardStyleInterpolator,
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
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await loadAsync({
          'StackSansHeadline-Regular': require('./assets/fonts/StackSansHeadline-Regular.ttf'),
          'StackSansHeadline-Medium': require('./assets/fonts/StackSansHeadline-Medium.ttf'),
          'StackSansHeadline-SemiBold': require('./assets/fonts/StackSansHeadline-SemiBold.ttf'),
          'StackSansHeadline-Bold': require('./assets/fonts/StackSansHeadline-Bold.ttf'),
          'StackSansHeadline-Light': require('./assets/fonts/StackSansHeadline-Light.ttf'),
          'StackSansHeadline-ExtraLight': require('./assets/fonts/StackSansHeadline-ExtraLight.ttf'),
        });
        console.log('Fonts loaded successfully');
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };
    loadFonts();
  }, []);

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
