import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../styles/Colors";
import * as Location from "expo-location";
import { useState, useEffect } from "react";
import MapView, { Marker, LocalTile, UrlTile, Circle } from "react-native-maps";

export default function OfflineModeMap() {
    const [location, setLocation] = useState(null);

    /*
    useEffect(() => {
        (async () => {
            let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});
            console.log(location);
            setLocation(location);
        })();

    }, []);
    */

    useEffect(() => {
        (async () => {
            const subscription = await Location.watchPositionAsync({accuracy: Location.Accuracy.Highest}, (result) => {
                setLocation(result);
            });

            return (() => {subscription.remove();})
        })();
    }, [location]);

    let data;
    let text;
  
    if (location) {
        data = location["coords"];
        text = data["latitude"] + " " + data["longitude"];
        // console.log(location["coords"]);

        return (
            <View style={styles.container}>
                <Text style={styles.text}>Your location: {text}</Text>
                <MapView       
                    style={{
                        flex: 1,
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
                    <LocalTile pathTemplate={"/data/user/0/com.Help.Hub/files/map/{z}/{x}/{y}.png"} tileSize={256} zIndex={-1}/>                            
                </MapView>
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
})