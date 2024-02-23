import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AccIdContext } from '../../../../Contexts';

const Profile = () => {
  const { AccId } = useContext(AccIdContext);

  console.log("PROFILE UID: " + String(AccId));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.profilePicContainer}>
          <Text style={styles.profilePicText}>PFP / TAP TO CHANGE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name</Text>
        <Text style={styles.infoText}>Email</Text>
        <Text style={styles.infoText}>Phone Number</Text>
        <Text style={styles.infoText}>Address (Not Shared to Anyone Except SAR)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MEDICAL INFORMATION</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Blood Type</Text>
        <Text style={styles.infoText}>Emergency Contact Name</Text>
        <Text style={styles.infoText}>Emergency Contact Phone #</Text>
        <Text style={styles.infoText}>Emergency Contact Email</Text>
        <Text style={styles.infoText}>Gender</Text>
        <Text style={styles.infoText}>Weight</Text>
        <Text style={styles.infoText}>Height</Text>
        <Text style={styles.infoText}>Organ Donor</Text>
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
    backgroundColor: '#fff',
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
    borderColor: 'black',
    height: 150, // Set a fixed height for the profile picture container
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
    backgroundColor: 'black',
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