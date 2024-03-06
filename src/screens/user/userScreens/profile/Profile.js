import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AccIdContext } from '../../../../Contexts';

import themeContext from '../../../../theme/themeContext';


const Profile = () => {
  const { AccId } = useContext(AccIdContext);
  const theme = useContext(themeContext);

  console.log("PROFILE UID: " + String(AccId));

  return (
    <ScrollView style={[styles.container, {color: theme.backgroundColor}]}>
      <View style={[styles.section, {color: theme.backgroundColor}]}>
        <TouchableOpacity style={[styles.profilePicContainer, {borderColor: theme.color}]}>
          <Text style={[styles.profilePicText, {color: theme.color}]}>PFP / TAP TO CHANGE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, {color: theme.color}]}>Name</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Email</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Phone Number</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Address (Not Shared to Anyone Except SAR)</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.color}]}>MEDICAL INFORMATION</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, {color: theme.color}]}>Blood Type</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Emergency Contact Name</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Emergency Contact Phone #</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Emergency Contact Email</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Gender</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Weight</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Height</Text>
        <Text style={[styles.infoText, {color: theme.color}]}>Organ Donor</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  profilePicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 100,
    borderWidth: 1,
    height: 150,
  },
  profilePicText: {
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: 'lightgrey',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 20,
  },
  infoText: {
    fontSize: 16,
    paddingBottom: 5, // Add some space between info texts
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: 'gray',
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;