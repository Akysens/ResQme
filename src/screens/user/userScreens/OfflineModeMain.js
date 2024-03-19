import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Alert } from 'react-native';
import {useEffect, useContext, useState} from "react";
import * as Colors from "../styles/Colors";
import { NavigationContainer } from '@react-navigation/native';
import OfflineModeMap from "./OfflineModeMap";
import OfflineModeConnect from './OfflineModeConnect';
import Icon from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";

import * as Nearby from "../../../../modules/helphub-nearby";
import OfflineModeMessageScreen from './OfflineModeMessage';

function isLocationData(str) {
    try {
        let data = JSON.parse(str);
        if (typeof data != Object) {
            return false;
        }

        if (data["coords"]) {
            return true;
        }
        
        return false;
    }
    catch (error) {
        return false;
    }
}

const Tab = createBottomTabNavigator();

export default function OfflineModeMain() {
        // Discovered devices
        [discoveredDevices, setDiscoveredDevices] = useState(null);

        // Connected devices
        [connectedDevices, setConnectedDevices] = useState([]);

        // Location (managed by Map screen)
        [location, setLocation] = useState(null);

        // Discovered device locations
        [locations, setLocations] = useState([]);
    
        // Username
        [userName, setUserName] = useState("ResQmeUser");
    
        // Whether we have showed the warning for the users
        [warned, setWarned] = useState(false);
    
        [searching, setSearching] = useState(false);
    
        // Selected device (i.e to connect)
        [selected, setSelected] = useState(null);

        // Messages
        [messages, setMessages] = useState(new Map());

        const sendLocation = async (endpointId) => {
            const loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest})  
        
            Nearby.sendPayload(endpointId, loc);
            console.log("Location data sent to: " + endpointId); // for debug
        }

        // Adds a device to connectedDevices ONLY IF it is not there
        function setConnectedDevicesUnique(endpoint) {
            if(!connectedDevices.includes(endpoint)) {
                setConnectedDevices([...connectedDevices, endpoint]);
            }
        };
    
        // Show a warning about app switching to offline mode
        if (!warned) {
            Alert.alert(
                "No internet connection!",
                "App will now switch to offline mode."
            );
            setWarned(true);
        }
    
        // Subscriptions for listening various events
        useEffect(() => {
            // Informs when we discover a new devices
            const onNewDeviceDiscovered = Nearby.addDeviceDiscoveryListener((event) => {
                // Get currently discovered devices
                setDiscoveredDevices(Nearby.getDiscoveredEndpoints());
                console.log(discoveredDevices);
                console.log(connectedDevices);
            });


            // Informs when a new connection is initiated (by user or someone else)
            const onConnectionInitiated = Nearby.addNewConnectionListener((event) => {
                if (event.isIncomingConnection) {
                    Alert.alert(
                        "Connection Request",
                        "A connection from " + event.endpointName + " was requested. Authentication token: " + event.authenticationToken,
                        [
                            {
                                text: "Accept",
                                onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique(event.endpointId); 
                                    console.log(connectedDevices);},
                            },
                            {
                                text: "Reject",
                                onPress: () => {Nearby.rejectConnection(event.endpointId)},
                            }
                        ]
                    )
                }
                else {
                    Alert.alert(
                        "Connection Request",
                        "Authentication token for your request" + event.authenticationToken,
                        [
                            {
                                text: "Accept",
                                onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique(event.endpointId);},
                            },
                            {
                                text: "Reject",
                                onPress: () => {Nearby.rejectConnection(event.endpointId)},
                            }
                        ]
                    )
                }
            });
    
            // Informs on connection updates (e.g connection lost, succesful)
            const onConnectionUpdate = Nearby.addConnectionUpdateListener((event) => {
                console.log(event.status);
                switch (event.status) {
                    case 0:
                        Alert.alert("Connection Successful", "You successfully connected to endpoint " + event.endpointId, [{text: "OK"}]);
                        setConnectedDevicesUnique(event.endpointId);
                        setDiscoveredDevices(discoveredDevices.filter(function(e) {return e !== event.endpointId}));
                        setMessages(new Map(messages.set(event.endpointId, [])));
                        sendLocation(event.endpointId);
                        break;
                    case 15:
                        Alert.alert("Connection Failed", "Timeout while trying to connect. Error code: " + event.status, [{text: "OK"}]);
                        setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}));
                        setLocations(locations.filter(function(e) {return e.device !== event.endpointId }));
                        break;
                    case 16:
                        Alert.alert("Connection Lost", "Connection was cancelled. Error code: " + event.status, [{text: "OK"}]);
                        setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}));
                        setLocations(locations.filter(function(e) {return e.device !== event.endpointId }));
                        break;
                    case 7:
                        Alert.alert("Connection Lost", "A network error occurred. Please try again. Error code: " + event.status, [{text: "OK"}]);
                        setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}));
                        setLocations(locations.filter(function(e) {return e.device !== event.endpointId }));
                        break;
                    case 13: 
                        Alert.alert("Connection Lost", "Disconnected. Error code: " + event.status, [{text: "OK"}]);
                        setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}));
                        setLocations(locations.filter(function(e) {return e.device !== event.endpointId }));
                        break;
                };
            });

            // Informs when a device is disconnected
            const onDisconnected = Nearby.addDisconnectionListener((event) => {
                Alert.alert("Connection Lost", "Disconnected.", [{text: "OK"}]);
                setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
            });

            // Informs a payload (message) is received
            const onPayloadReceived = Nearby.addPayloadReceivedListener((event) => {
                if (isLocationData(event.message)) {
                    let locationData = JSON.parse(event.message); 
                    setLocations([...locations, {device: endpointId, location: locationData["coords"]}]);
                }
                else {
                    Alert.alert("Received Message", "From: " + event.endpointId + "\n" + event.message);
                    setMessages(new Map(messages.set(event.endpointId, [...messages.get(event.endpointId), {from: event.endpointId, message: event.message}])));
                }
            });
        
            return (() => {
                onNewDeviceDiscovered.remove();
                onConnectionInitiated.remove();
                onConnectionUpdate.remove();
                onDisconnected.remove();
                onPayloadReceived.remove();
            })

        }, [])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                headerShown: false,
                tabBarShowLabel: false,
            }}
            initialRouteName='OMConnections'
        >

            <Tab.Screen 
                name="OMConnections"
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="wifi" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            >
                {() => (<OfflineModeConnect searching={searching} setSearching={setSearching} 
                                            userName={userName} setUserName={setUserName}
                                            connectedDevices={connectedDevices} discoveredDevices={discoveredDevices}
                                            setConnectedDevices={setConnectedDevicesUnique}/>)}
            </Tab.Screen>

            <Tab.Screen 
                name="OMMap"
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="pin-drop" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            >
                {() => (<OfflineModeMap location={location} setLocation={setLocation} receivedLocations={locations} />)}
            </Tab.Screen>

            <Tab.Screen 
                name="OMMessage"
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon name="chat" size={35} color={focused ? Colors.magenta : Colors.snow}/>
                    )
                }}
            >
                {() => (<OfflineModeMessageScreen messages={messages} setMessages={setMessages}/>)}
            </Tab.Screen>

        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: Colors.containerBackground,
        borderTopWidth: 0,
    }
})