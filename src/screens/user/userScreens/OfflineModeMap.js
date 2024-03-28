import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors";
import * as Location from "expo-location";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import MapView, { Marker, LocalTile, UrlTile, Circle } from "react-native-maps";

import * as Nearby from "../../../../modules/helphub-nearby";

export default function OfflineModeMap({connectedDevices, location, setLocation, receivedLocations}) {
    [lastSentLocation, setLastSentLocation] = useState("None");
    
    /*
    useEffect(() => {
        (async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
            console.log(location);
            setLocation(location);
        })();

    }, []);
    */

    function renderLocations(locations) {
        let array = [];
        for (const [key, value] of locations.entries()) {
            array.push((
                <Marker
                key={key}
                coordinate={{latitude: value["latitude"], longitude: value["longitude"]}}
                title={key}
                description={"Accuracy: " + value["accuracy"]} />
            ));
        }

        return array;
    }

    function updateLocationToConnectedDevices() {
        connectedDevices.map((item, index) => {
            Nearby.sendPayload(item, JSON.stringify(location));
        });
        data = location["coords"];
        text = data["latitude"] + " " + data["longitude"];

        setLastSentLocation(text);
    }

    useEffect(() => {
        (async () => {
            const subscription = await Location.watchPositionAsync({accuracy: Location.Accuracy.High}, (result) => {
                setLocation(result);
            });

            return (() => {subscription.remove();})
        })();
    }, []);

    let data;
    let text;
  
    if (location) {
        data = location["coords"];
        text = data["latitude"] + " " + data["longitude"];
        // console.log(location["coords"]);

        return (
            <View style={styles.container}>
                <MapView       
                    style={{
                        flex: 5,
                    }}
                    minZoomLevel={19}
                    maxZoomLevel={19}
                    mapType="none"
                    initialRegion={{latitude: data["latitude"], longitude: data["longitude"], latitudeDelta: 0.01, longitudeDelta: 0.01}}
                >
                    <Marker
                        coordinate={{latitude: data["latitude"], longitude: data["longitude"]}}
                        title="Your Location"
                        description={"Accuracy: " + Math.round(data["accuracy"])+ "m"} 
                    />
                    <Circle
                        center={{latitude: data["latitude"], longitude: data["longitude"]}}
                        radius={data["accuracy"]}
                        strokeColor="rgba(136, 20, 177, 0.5)"
                        strokeWidth={1}
                        fillColor="rgba(136, 20, 177, 0.1)"
                    />

                    {renderLocations(receivedLocations)}

                    <LocalTile pathTemplate={"/data/user/0/com.Help.Hub/files/map/{z}/{x}/{y}.png"} tileSize={256} zIndex={-1}/>                            
                </MapView>
                <View style={styles.mapUtility}>   
                    <View style={styles.mapLocationInfo}>
                        <View style={styles.mapLocationInfoTextBox}>
                            <Text style={styles.text}>Current location:</Text>
                            <Text style={styles.text}>{text}</Text>
                        </View>
                        <View style={styles.mapLocationInfoTextBox}>
                            <Text style={styles.text}>Your last update:</Text>
                            <Text style={styles.text}>{lastSentLocation}</Text>
                        </View>
                    </View>
                    
                    <Button onPress={updateLocationToConnectedDevices} primary={true}>
                        <Text style={styles.buttonText}>Update Location</Text>
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View style={{...styles.container, justifyContent: "center", alignItems: "center"}}>
            <Text style={styles.text}>Please wait a moment while we figure out your location.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        backgroundColor: Colors.background,
        padding: 20,
        paddingTop: 40,
    },
    text: {
        fontFamily: "OpenSans",
        fontSize: 10,
        fontWeight: 900,
        color: Colors.gray,
        marginBottom: 10,
    },
    mapUtility: {
        flex: 1,
        padding: 10,
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    mapLocationInfo: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    mapLocationInfoTextBox: {
        flexDirection: "column", 
        alignItems: "center"
    },
    buttonText: {
        fontFamily: "OpenSans",
        fontSize: 14,
        color: Colors.snow,
        fontWeight: 900,
    },
})