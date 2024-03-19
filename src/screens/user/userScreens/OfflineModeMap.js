import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { LocalTile } from "react-native-maps";


function lon2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }


export default function OfflineModeMap() {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});

            setLocation(location);
        })();
    }, []);

    let text = "waiting...";
    if (location) {
        data = location["coords"];
        text = data["latitude"] + " " + data["longitude"];
        console.log(data);
        console.log("X: ", lon2tile(data["longitude"], 19));
        console.log("Y: ", lat2tile(data["latitude"], 19));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{text}</Text>
            <MapView       
                style={{
                    flex: 1,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0,
                    position: "absolute",
                }}
                minZoomLevel={19}
                maxZoomLevel={19}  
                initialRegion={{latitude: 53.166345, longitude: 8.6550214, latitudeDelta: 0.01, longitudeDelta: 0.01}}
                mapType="none"
            >
                <LocalTile pathTemplate={"C:/Users/enesy/Documents/webprojects/resqme_old/src/screens/user/map/{z}/{x}/{y}.png"} tileSize={256} zIndex={-1}/>                            
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
        paddingTop: 40,
    },
    text: {
        fontFamily: "OpenSans",
        fontSize: 10,
        fontWeight: 900,
        color: Colors.gray,
    },
})