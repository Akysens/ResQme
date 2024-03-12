import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

import themeContext from '../../../theme/themeContext';

import i18next from '../../../../services/i18next';
import { useTranslation } from 'react-i18next';

const RequestItem = ({ username, distance, requestText, timestamp }) => {
  const {t} = useTranslation();

  return (
    <View style={styles.requestItem}>
      <View style={styles.headerContainer}>
        <Text style={styles.usernameText}>{t('requests_text_userrequestitem')}</Text>
        <Text style={styles.timestampText}>{timestamp}</Text>
      </View>
      <Text style={styles.requestText}>{requestText}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('requests_button_showonmap')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('requests_button_providehelp')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('requests_button_dismiss')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RequestsPage = () => {

  const theme = useContext(themeContext);

  // This would be your data fetched from your backend or state management
  const requestsData = [
    // Example data structure
    {
      username: 'User123',
      distance: '2 km away',
      requestText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      timestamp: '1hr ago',
    },
    // More requests...
  ];

  return (
    <View style={[styles.container, {color: theme.backgroundColor}]}>
      <ScrollView>
        {requestsData.map((request, index) => (
          <RequestItem
            key={index}
            username={request.username}
            distance={request.distance}
            requestText={request.requestText}
            timestamp={request.timestamp}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  requestItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  usernameText: {
    fontWeight: 'bold',
  },
  timestampText: {
    fontStyle: 'italic',
  },
  requestText: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4e4e4e',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default RequestsPage;