import React, { useState, useContext, useEffect } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { LogBox, Alert } from 'react-native';
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

import OfflineModeMain from './screens/user/userScreens/offlinemode/OfflineModeMain';

import NetInfo from "@react-native-community/netinfo";
import { MenuProvider } from "react-native-popup-menu";
import { AccModeContext, AccIdContext } from './Contexts';

import { EventRegister } from 'react-native-event-listeners';
import { dataDetectorType } from 'deprecated-react-native-prop-types/DeprecatedTextPropTypes';
import theme from './theme/theme';
import themeContext from './theme/themeContext';
// import { OfflineMode } from './screens/user/userScreens';

import i18next from '../services/i18next';
import { useTranslation } from 'react-i18next';

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
  const {t} = useTranslation();

  const { accMode } = useContext(AccModeContext);
  const theme = useContext(themeContext);
  
  return ( 
    <MainTab.Navigator screenOptions={{ headerShown: true, headerTitleAlign: 'center', headerTitleStyle: { fontWeight: 'bold' } }}>
      <MainTab.Screen name={t('app_screenname_requests')} component={Requests} options={{
        tabBarIcon: () => (
          <Image
            source={theme.theme === 'dark' ? require('./assets/Image8White.png') : require('./assets/Image8.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
      <MainTab.Screen name={t('app_screenname_notifications')} component={Notifications} options={{
        tabBarIcon: () => (
          <Image
            source={theme.theme === 'dark' ? require('./assets/Image5White.png') : require('./assets/Image5.png')}
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
      <MainTab.Screen name={t('app_screenname_profile')} component={Profile} options={{
        tabBarIcon: () => (
          <Image
            source={theme.theme === 'dark' ? require('./assets/Image6White.png') : require('./assets/Image6.png')}
            style={{ width: 24, height: 24 }}
          />
        ),
      }} />
      <MainTab.Screen name={t('app_screenname_settings')} component={Settings} options={{
        tabBarIcon: () => (
          <Image
          source={theme.theme === 'dark' ? require('./assets/Image7White.png') : require('./assets/Image7.png')}
          style={{ width: 24, height: 24 }}
          />
        ),
      }} />
    </MainTab.Navigator>
  );
}

const RootStack = createStackNavigator();

LogBox.ignoreAllLogs();
function App() {
  const [accMode, setAccMode] = useState(null);
  const [AccId, setAccId] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) => {
      setDarkMode(data);
    })
    return () => {
      EventRegister.removeAllListeners(listener);
    }
  }, [darkMode])

  const [appIsReady, setAppIsReady] = useState(false); 
  const [internetReachable, setInternetReachable] = useState(null);

  const getInternetStatus = async () => {
    try {
      const netInfo = await NetInfo.fetch();
      const isInternetReachable = netInfo.isInternetReachable;
      setInternetReachable(isInternetReachable);
    }
    catch (error) {
      console.warn(error);
    }
    finally {
      if (internetReachable !== null) {
        setAppIsReady(true);
      };
    }
  }

  useEffect(() => {
    async function prepare() {
      await getInternetStatus();
    }

    prepare();
  }, [internetReachable]);

  if (!appIsReady) {
    return null;
  }

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
      <MenuProvider>
      <AccModeContext.Provider value={{ accMode, setAccMode }}>
          <AccIdContext.Provider value={{ AccId, setAccId }}>
            <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
              <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {internetReachable ?
                  (<>
                    <RootStack.Screen name="Auth" component={AuthStackScreen} />
                    <RootStack.Screen name="MainApp" component={MainTabScreen} />
                    <RootStack.Screen name="Advice_Screen" component={Advice_Screen} />
                  </>)
                    :
                 (<RootStack.Screen name="OfflineModeMain" component={OfflineModeMain} />)}
            </RootStack.Navigator>
            </NavigationContainer>
          </AccIdContext.Provider>
        </AccModeContext.Provider>
        </MenuProvider>
    </themeContext.Provider>    
  );
}

export default App;