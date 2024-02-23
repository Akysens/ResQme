import React, { useState, useContext } from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/auth/LoginScreen';
import SignInScreen from './screens/auth/SignInScreen';
import Slider_Screen from './screens/user/userScreens/Slider_Screen';
import Advice_Screen from './screens/user/userScreens/Advice_Screen';
import SAR_Team_Screen from './screens/user/userScreens/SAR_Team_Screen';
import Requests from './screens/user/userScreens/Requests';
import Notifications from './screens/user/userScreens/Notifications';
import Profile from './screens/user/userScreens/profile/Profile';
import Settings from './screens/user/userScreens/Settings';
import AccModeContext from './Contexts';

const AuthStack = createStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignInScreen" component={SignInScreen} />
    </AuthStack.Navigator>
  );
}

const MainTab = createBottomTabNavigator();

function MainTabScreen() {
  const { accMode } = useContext(AccModeContext);

  return (
    <MainTab.Navigator screenOptions={{ headerShown: true, headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' } }}>
      <MainTab.Screen name="Requests" component={Requests} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/RequestSymbol.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
      <MainTab.Screen name="Notifications" component={Notifications} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/NotifSymbol.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
      {accMode === "rescuer" && <MainTab.Screen name=" " component={SAR_Team_Screen} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/MainPlus.png')}
            style={{ width: 50, height: 50 }}
          />
        ),
      }} />}
      {accMode === "victim" && <MainTab.Screen name=" " component={Slider_Screen} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/MainPlus.png')}
            style={{ width: 50, height: 50 }}
          />
        ),
      }} />}
      <MainTab.Screen name="Profile" component={Profile} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/Profile.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
      <MainTab.Screen name="Settings" component={Settings} options={{
        tabBarIcon: () => (
          <Image
            source={require('./assets/Settings.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
    </MainTab.Navigator>
  );
}

const RootStack = createStackNavigator();

function App() {
  const [accMode, setAccMode] = useState(null);

  return (
    <AccModeContext.Provider value={{ accMode, setAccMode }}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Auth" component={AuthStackScreen} />
          <RootStack.Screen name="MainApp" component={MainTabScreen} />
          <RootStack.Screen name="Advice_Screen" component={Advice_Screen} />
        </RootStack.Navigator>
      </NavigationContainer>
    </AccModeContext.Provider>
  );
}

export default App;