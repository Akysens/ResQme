import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Image } from 'react-native';
import * as Location from 'expo-location'
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@firebaseConfig';

const { width, height } = Dimensions.get('window');

// Clicking on one of these on the map will bring up 2 options kinda obstructed by the bottom bar (Android)
const SAR_Screen = ({ navigation }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usersLocations"), (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { latitude, longitude, timestamp } = doc.data();
        users.push({ id: doc.id, latitude, longitude, timestamp });
      });
      setUserData(users);
    });

    return () => unsubscribe();
  }, []);

  const [location, setLocation] = useState({});

  useEffect(() => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            enableHighAccuracy: true,
            timeInterval: 5
        });
        setLocation(location);
    })();
  }, []);

  const mapRef = React.createRef();

  const goToMyLocation = async () => {
    mapRef.current.animateCamera({center: {"latitude":location.coords.latitude, "longitude": location.coords.longitude}});
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}/>
        {/* {userData.map((user) => ( */}
          {/* <Marker */}
            {/* key={user.id} */}
            {/* coordinate={{ latitude: user.latitude, longitude: user.longitude }} */}
            {/* title={`User ${user.id}`} */}
            {/* description={`Timestamp: ${user.timestamp}`} */}
          {/* /> */}
        {/* ))} */}
        {/* <Text>Hi</Text> */}
      {/* </MapView> */}
      <TouchableOpacity style={styles.fab} onPress={goToMyLocation}>
        <Image source={require('../../../assets/center.png')}
        style={styles.fabIcon}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 20,
    top: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  map: {
    width: "100%",
    height: "100%", // minus header height
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
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default SAR_Screen;