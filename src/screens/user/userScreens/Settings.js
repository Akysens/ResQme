import React, { useState, useContext } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Button, Alert, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import legal from '../../../assets/legal.json';
import { EventRegister } from 'react-native-event-listeners';

import themeContext from '../../../theme/themeContext';
import { placeholder } from 'deprecated-react-native-prop-types/DeprecatedTextInputPropTypes';
import DropDownPicker from 'react-native-dropdown-picker';

import i18next from '../../../../services/i18next';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const {t} = useTranslation();

  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  // More languages to be added into the future
  const [items, setItems] = useState([
    {label: 'English', value: 'en'},
    {label: 'Español', value: 'es'},
    {label: 'Türkçe', value: 'tr'},
    {label: 'اردو', value: 'ur'}
  ]);
  
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [sound, setSound] = React.useState(false);
  const [vibration, setVibration] = React.useState(false);
  const [language, setLanguage] = React.useState(null);

  showInfo = (msg) =>
    Alert.alert('Legal Information', msg, [
      {
        text: 'OK', 
        onPress: () => console.log('OK Pressed')
      },
    ]);

  const changeLng = lng => {
    i18next.changeLanguage(lng);
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.color}]}>{t('settings_label_darkmode')}</Text>
        <View style={styles.subsection}>
          {/* Dark Mode switch */}
          <Text style={[styles.subLabel, {color: theme.color}]}>{t('settings_button_darkmodeenable')}</Text> 
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              EventRegister.emit('ChangeTheme', value)
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.color}]}>{t('settings_label_notifications')}</Text>
        <View style={styles.subsection}>
          <Text style={[styles.subLabel, {color: theme.color}]}>{t('settings_button_pushnotifs')}</Text>
          <Switch
            value={pushNotifications}
            onValueChange={(value) => setPushNotifications(value)}
          />
        </View>
        <View style={styles.subsection}>
          <Text style={[styles.subLabel, {color: theme.color}]}>{t('settings_button_soundnotifs')}</Text>
          <Switch
            value={sound}
            onValueChange={(value) => setSound(value)}
          />
        </View>
        <View style={styles.subsection}>
          <Text style={[styles.subLabel, {color: theme.color}]}>{t('settings_button_vibrationnotifs')}</Text>
          <Switch
            value={vibration}
            onValueChange={(value) => setVibration(value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.color}]}>{t('settings_label_language')}</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={() => changeLng(value)}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: theme.color}]}>{t('settings_label_about')}</Text>
        <TouchableOpacity onPress={() => showInfo(legal[1].contents)}>
          <Text style={styles.hyperlink}>{t('settings_link_legal')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showInfo(legal[0].contents)}>
          <Text style={styles.hyperlink}>{t('settings_link_termsandconditions')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: 'red'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    position: "relative",
    left: 106,
    top: 20,
    marginBottom: 20,
  },
  section: {
    top: 0,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  subLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  subsection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#fff'
  },
  hyperlink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default Settings;