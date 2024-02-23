import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AccIdContext } from '../../../../Contexts';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@firebaseConfig';

const Profile = () => {
  const { AccId } = useContext(AccIdContext);
  const [userData, setUserData] = useState(null);
  const [userMedData, setUserMedData] = useState(null);

  useEffect(() => {
    GetUserData();
  }, []);

  // async function to get the user's data and med data from db to display
  // in profile
  const GetUserData = async () => {
    const userMedDoc = doc(db, "usersMedicalInfo", AccId);
    const userMedProfile = await getDoc(userMedDoc);
    const userMedData = userMedProfile.data();
    setUserMedData(userMedData); // Use setUserMedData to update userMedData
  
    const userPersDoc = doc(db, "users", AccId);
    const userProfile = await getDoc(userPersDoc);
    const userData = userProfile.data();
    setUserData(userData); // Use setUserData to update userData
  }

  if (!userData) {
    return <Text>Loading...</Text>; // or any loading indicator
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <TouchableOpacity style={styles.profilePicContainer}>
          <Text style={styles.profilePicText}>PFP / TAP TO CHANGE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Name: {userData.name}</Text>
        <Text style={styles.infoText}>Email: {userData.email} </Text>
        <Text style={styles.infoText}>Phone Number: {userData.phoneNum}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MEDICAL INFORMATION</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Blood Type: {userMedData.BloodType}</Text>
        <Text style={styles.infoText}>Emergency Contact Name: {userMedData.EmergencyContactName}</Text>
        <Text style={styles.infoText}>Emergency Contact Phone #: {userMedData.EmergencyContactNumber}</Text>
        <Text style={styles.infoText}>Emergency Contact Email: {userMedData.EmergencyContactEmail}</Text>
        <Text style={styles.infoText}>Gender: {userMedData.Gender}</Text>
        <Text style={styles.infoText}>Weight: {userMedData.Weight} kg</Text>
        <Text style={styles.infoText}>Height: {userMedData.Gender} cm</Text>
      </View>

      <TouchableOpacity 
      style={styles.logoutButton}
      >
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