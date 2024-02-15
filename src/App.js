import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/auth/LoginScreen'; 
import SignupScreen from './screens/auth/SignInScreen';
import { LogBox } from 'react-native';
import VolunteerMapScreen from './screens/user/userScreens/SAR_Team_Screen';

// STATE PROVIDER (easy-peasy)
import { StoreProvider } from "easy-peasy";
import store from "./state";

const Stack = createNativeStackNavigator();

function App() {
	LogBox.ignoreAllLogs();
  return (
    <StoreProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login_Screen">
          
          <Stack.Screen 
          name="Login_Screen" 
          component={LoginScreen}
          options={{ headerShown: false }} />

          <Stack.Screen 
          name="SignUp_Screen" 
          component={SignupScreen}
          options={{ headerShown: false }} />

          <Stack.Screen 
          name="SAR_Team_Screen" 
          component={VolunteerMapScreen} 
          options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
