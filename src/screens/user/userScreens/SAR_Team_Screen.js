import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Image, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebaseConfig';

const { width, height } = Dimensions.get('window');

const SAR_Screen = ({ navigation }) => {
  const [userData, setUserData] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedUserBloodType, setSelectedUserBloodType] = useState(null); // Added state to store selected user's blood type
  const [isMarkerSelected, setIsMarkerSelected] = useState(false); // Added state to track if a marker is selected
  const mapRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usersLocations"), async (querySnapshot) => {
      const users = [];
      for (const doc of querySnapshot.docs) {
        const { latitude, longitude, timestamp } = doc.data();
        const userTimestamp = getTimeDifference(timestamp);
        const id = doc.id;
        const name = await getNameFromOtherDatabase(id); // Fetch name from another database
        users.push({ id, name, latitude, longitude, userTimestamp });
      }
      setUserData(users);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          enableHighAccuracy: true,
          timeInterval: 5000
        });
        setLocation(location);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    })();
  }, []);

  const goToMyLocation = () => {
    if (location && location.coords && mapRef.current) {
      const { latitude, longitude } = location.coords;
      mapRef.current.animateCamera({
        center: { latitude, longitude },
      });
    } else {
      Alert.alert('Location Not Available', 'Unable to get current location.');
    }
  };

  const handleMarkerPress = async (id) => {
    try {
      const medicalSnap = await getDoc(doc(db, "usersMedicalInfo", id));

      if (medicalSnap.exists()) {
        setSelectedUserBloodType(medicalSnap.data().BloodType); // Set selected user's blood type
      } else {
        setSelectedUserBloodType("Unknown");
      }

      setIsMarkerSelected(true); // Set marker selection state to true
    } catch (error) {
      console.error("Error getting document: ", error);
      setSelectedUserBloodType("Unknown");
    }
  }

  const handleMapPress = () => {
    setSelectedUserBloodType(null); // Clear selected user's blood type
    setIsMarkerSelected(false); // Set marker selection state to false
  }

  const getTimeDifference = (timestamp) => {
    const currentTime = new Date().getTime();
    const timestampTime = timestamp.toMillis(); // Assuming timestamp is a Firestore Timestamp object
  
    const difference = currentTime - timestampTime;
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDifference = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  
    return { days: daysDifference, hours: hoursDifference, minutes: minutesDifference };
  };

  const getNameFromOtherDatabase = async (id) => {
    try {
      const docSnap = await getDoc(doc(db, "users", id));
      if (docSnap.exists()) {
        return docSnap.data().name;
      } else {
        return "Unknown";
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      return "Unkown";
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress} // Handle tap on map to clear selected user's information
      >
        {userData.map((user) => (
          <Marker
            key={user.id}
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            title={user.name} // Change title to user's name
            description={`Help requested: ${user.userTimestamp.days} days ${user.userTimestamp.hours} hrs ${user.userTimestamp.minutes} mins ago`}
            onPress={() => handleMarkerPress(user.id)} // Call handleMarkerPress when marker is pressed
          />
        ))}
      </MapView>
      
      <TouchableOpacity style={styles.fab} onPress={goToMyLocation}>
        <Image source={require('../../../assets/center.png')} style={styles.fabIcon}/>
      </TouchableOpacity>
      
      {isMarkerSelected && selectedUserBloodType && ( // Conditionally render blood type container only when a marker is selected
        <View style={styles.bloodTypeContainer}>
          <Text style={styles.bloodTypeText}>Blood Type: {selectedUserBloodType}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: width,
    height: height,
  },
  fab: {
    position: 'absolute',
    right: 10,
    bottom: 115,
    backgroundColor: '#0066ff',
    padding: 15,
    borderRadius: 30,
    elevation: 2,
  },
  fabIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bloodTypeContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SAR_Screen;
