import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

import themeContext from '../../../theme/themeContext';

import i18next from '../../../../services/i18next';
import { useTranslation } from 'react-i18next';

// Mock data for notifications with date and time
const initialNotifications = [
  { id: '1', text: 'Your order has been shipped.', dateTime: 'Feb 8, 4:30 PM' },
  { id: '2', text: 'Your payment was received.', dateTime: 'Feb 7, 3:10 PM' },
  // ... other notifications
];


const NotificationItem = ({ text, dateTime, onDismiss, t }) => (
  
  (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{text}</Text>
        <Text style={styles.notificationDateTime}>{dateTime}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
        <Text>{t('notifications_button_dismiss')}</Text>
      </TouchableOpacity>
    </View>
  )
  
);

const NotificationsScreen = () => {
  const {t} = useTranslation();

  const theme = useContext(themeContext);

  const [notifications, setNotifications] = useState(initialNotifications);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const dismissAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, {color: theme.color}]}>{t('notifications_header_notifications')}</Text>
        <TouchableOpacity onPress={dismissAllNotifications} style={styles.dismissAllButton}>
          <Text style={{color: theme.color}}>{t('notifications_button_dismissall')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            text={item.text}
            dateTime={item.dateTime}
            onDismiss={() => dismissNotification(item.id)}
            t = {t}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />} // Add space between items
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 20,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerText: {
    fontSize: 20,
  },
  dismissAllButton: {
    // Style for the 'Dismiss All' button
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // Assuming a white background
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 5, // Add some space between the text and the date/time
  },
  notificationDateTime: {
    fontSize: 12,
    color: '#666', // A lighter color for the date/time
  },
  dismissButton: {
    // Style for the dismiss button on each notification
  },
  separator: {
    height: 10, // Adjust the space as needed
  },
});

export default NotificationsScreen;