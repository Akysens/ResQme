import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/auth/LoginScreen'; 
import SignupScreen from './screens/auth/SignInScreen';
import SAR_Screen from './screens/user/userScreens/SAR_Team_Screen';
import { LogBox } from 'react-native';
import Slider_Screen from './screens/user/userScreens/Slider_Screen';
import Advice_Screen from './screens/user/userScreens/Advice_Screen';
import OfflineMode from './screens/user/userScreens/OfflineMode';
import NetInfo from '@react-native-community/netinfo';


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
          name="Slider_Screen"
          component={Slider_Screen}
          options={{ headerShown: false }} />

        {() => {NetInfo.fetch().then(state => {
          console.log("Is connected?", state.isConnected);
        })}}

        <Stack.Screen
          name="Advice_Screen"
          component={Advice_Screen}
          options={{ headerShown: false }} />

        </Stack.Navigator>
      </NavigationContainer>
    </StoreProvider>
  );
}

export default App;
