import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/auth/LoginScreen'; 
import SignupScreen from './screens/auth/SignInScreen';
import Volunteer_Screen from './screens/user/userScreens/Volunteer';
import SAR_Screen from './screens/user/userScreens/SAR_Team_Screen';
import { LogBox } from 'react-native';

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
          name="SAR_Screen" 
          component={SAR_Screen} 
          options={{ headerShown: false }} />

        <Stack.Screen
          name="Volunteer_Screen"
          component={Volunteer_Screen}
          options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
