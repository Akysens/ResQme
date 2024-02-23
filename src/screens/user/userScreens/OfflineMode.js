// React
import { useEffect, useRef, useState, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";

// UI
import { SafeAreaView, View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { SegmentedButtons, Banner, Text, Button } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import Dialog from "react-native-dialog";

// State
import { useStoreState, useStoreActions } from "easy-peasy";
import NetInfo from "@react-native-community/netinfo";

import * as Nearby from "../../../../modules/helphub-nearby/index";
import DialogInput from "react-native-dialog/lib/Input";

function NewButton({primary = true, children = null, onPress = null}) {
    return (
      <Pressable
        onPressOut={onPress}
        style={({pressed}) => {
          if (pressed) {
            return styles.buttonPressed;
          }
          else {
            if (primary) {
              return styles.buttonPrimary;
            }
  
            else {
              return styles.buttonSecondary;
            }
          }
        }}>
          {children}
      </Pressable>
    );

}


const MessageDialog = ({endpointName, endpointId}) => {
    [messaging, setMessaging] = useState(false);
    [message, setMessage] = useState("");

    const sendMessage = (payload) => {
        Nearby.sendPayload(endpointId, payload);
        console.log("Message sent to: " + endpointId);
        setMessaging(false);
    }

    const handleCancel = () => {
        setMessaging(false);
    }

    return (            
        <Dialog.Container visible={messaging}>
            <Dialog.Title>Messaging</Dialog.Title>
            <Dialog.Description>
                Last Message from {endpointName}: {Nearby.getEndpointMessage(endpointId)};
            </Dialog.Description>
            <Dialog.Input label="Message to be sent" onChangeText={(text) => setMessage(text)}/>
            <Dialog.Button label="Cancel" onPress={handleCancel}/>
            <Dialog.Button label="Send" onPress={() => sendMessage(message)}/>
        </Dialog.Container>
    )
}


const NearbyDevice = ({endpointName, endpointId, userName, connectedDevices, setConnectedDevices}) => {
    const isConnected = () => {
        return connectedDevices.includes(endpointId);
    }
    
    const requestConnection = () => {
        Nearby.requestConnection(userName, endpointId);
        Alert.alert("Connection Request", "Connection request was sent to " + endpointId);
    };

    const disconnectFromEndpoint = () => {
        Nearby.disconnect(endpointId);
        setConnectedDevices(connectedDevices.filter(function(e) {return e !== endpointId}));
    }

    const openMessagingPanel = () => {
        setMessaging(true);
    }

    return (
        <>
            <MessageDialog endpointId={endpointId} endpointName={endpointName}/>
            <Menu>
                <MenuTrigger>
                    <View style={{...styles.deviceListItem, backgroundColor: isConnected() ? "#A1EEBD" : "#46424f"}}>
                        <Text style={styles.deviceListItemText}>{endpointName}</Text>
                        <Text style={styles.deviceListItemText}>{endpointId}</Text>
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    {
                        !isConnected() ? 
                            (<MenuOption text="Connect" onSelect={requestConnection}/>)
                                : 
                            (   
                                <>
                                    <MenuOption text="Disconnect" onSelect={disconnectFromEndpoint}/>
                                    <MenuOption text="Message" onSelect={openMessagingPanel}/>
                                </>
                            )
                    }
                </MenuOptions>
            </Menu>
        </>
    );
}

export default function OfflineMode() {
    [discoveredDevices, setDiscoveredDevices] = useState(null);
    [userName, setUserName] = useState("HelphubUser");
    [warned, setWarned] = useState(false);
    [advertising, setAdvertising] = useState(false);
    [discovering, setDiscovering] = useState(false);
    [selected, setSelected] = useState(null);
    [connectedDevices, setConnectedDevices] = useState([null]);

    function setConnectedDevicesUnique(endpoint) {
        if(!connectedDevices.includes(endpoint)) {
            setConnectedDevices([...connectedDevices, endpoint]);
        }
    };

    if (!warned) {
        Alert.alert(
            "No internet connection!",
            "App will now switch to offline mode."
        );
        setWarned(true);
    }

    const startAdvertising = () => {
        Nearby.startAdvertising(userName);
        setAdvertising(true);
    }

    const stopAdvertising = () => {
        Nearby.stopAdvertising();
        setAdvertising(false);
    }

    const startDiscovering = () => {
        Nearby.startDiscovery();
        setDiscovering(true);
    }

    const stopDiscovering = () => {
        Nearby.stopDiscovery();
        setDiscovering(false);
    }

    // const navigation = useNavigation();

    /* 
    useEffect(() => {
        const subscription = NetInfo.addEventListener((state) => {
            if (state.isInternetReachable === true) {
                Alert.alert(
                    "Internet found!",
                    "App will now switch to normal mode"
                )
    
                // navigation.navigate("Login_Screen");
            }
        });

        return () => subscription();
    }, [])

    */
    useEffect(() => {
        const onNewDeviceDiscovered = Nearby.addDeviceDiscoveryListener((event) => {
            setDiscoveredDevices(Nearby.getDiscoveredEndpoints());
            console.log(discoveredDevices);
        });

        const onConnectionInitiated = Nearby.addNewConnectionListener((event) => {
            if (event.isIncomingConnection) {
                Alert.alert(
                    "Connection Request",
                    "A connection from " + event.endpointName + " was requested. Authentication token: " + event.authenticationToken,
                    [
                        {
                            text: "Accept",
                            onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique([...connectedDevices, event.endpointId]);},
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
                            onPress: () => {Nearby.acceptConnection(event.endpointId); setConnectedDevicesUnique([...connectedDevices, event.endpointId]);},
                        },
                        {
                            text: "Reject",
                            onPress: () => {Nearby.rejectConnection(event.endpointId)},
                        }
                    ]
                )
            }
        });

        const onConnectionUpdate = Nearby.addConnectionUpdateListener((event) => {
            console.log(event.status);
            switch (event.status) {
                case 0:
                    Alert.alert("Connection Successful", "You successfully connected to endpoint " + event.endpointId, [{text: "OK"}]);
                    setConnectedDevices([...connectedDevices, event.endpointId]);
                    break;
                case 15:
                    Alert.alert("Connection Failed", "Timeout while trying to connect. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 16:
                    Alert.alert("Connection Lost", "Connection was cancelled. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 7:
                    Alert.alert("Connection Lost", "A network error occurred. Please try again. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
                case 15:
                    Alert.alert("Connection Failed", "Timeout while trying to connect. Error code: " + event.status, [{text: "OK"}]);
                    break;
                case 13: 
                    Alert.alert("Connection Lost", "Disconnected. Error code: " + event.status, [{text: "OK"}]);
                    setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
                    break;
            };
            
            const onDisconnected = Nearby.addDisconnectionListener((event) => {
                Alert.alert("Connection Lost", "Disconnected.", [{text: "OK"}]);
                setConnectedDevices(connectedDevices.filter(function(e) {return e !== event.endpointId}))
            })

            const onPayloadReceived = Nearby.addPayloadReceivedListener((event) => {
                Alert.alert("Received Message", "From: " + event.endpointId + "\n" + event.message);
            })
        })
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <Text style={styles.header}>Offline Mode</Text>
                <View style={styles.deviceList}>
                    <FlatList 
                        renderItem={({item}) => {
                            return <NearbyDevice endpointId={item.id} endpointName={item.name} userName={userName} connectedDevices={connectedDevices} setConnectedDevices={setConnectedDevices}/>;
                        }}
                        data={discoveredDevices}
                    >
                    </FlatList>
                </View>
                <View style={styles.buttonContainer}>
                    <NewButton primary={!discovering}
                        onPress={(discovering ? stopDiscovering : startDiscovering)}>
                        <Text>Discover</Text>
                    </NewButton>
                    <NewButton primary={!advertising}
                        onPress={advertising ? stopAdvertising : startAdvertising}>
                        <Text>Advertise</Text>
                    </NewButton>
                </View>
                <Text style={{color: "white"}}>Selected: {selected}</Text>
                <TextInput
                    style={styles.nameInput}
                    placeholder="Type your name here."
                    onChangeText={newText => setUserName(newText)}
                    defaultValue={userName}
                />
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1a1625",
    },
    safeArea: {
        flex: 1,
        flexDirection: "column",
        padding: 20,
        marginTop: 20,
    },
    header: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#e0e0e0",
        textAlign: "center",
    },
    deviceList: {
        marginTop: 20,
        marginBottom: 20,
        padding: 10,
        borderColor: "#46424f",
        borderRadius: 5,
        borderWidth: 1,
        elevation: 5,
        width: "100%",
        flex: 4,
    },
    deviceListItem: {
        margin: "auto",
        padding: 10,
        backgroundColor: "#46424f",
        borderColor: "#2f2b3a",
        borderWidth: 1,
        borderRadius: 5,
        width: "100%",
        height: 60,
        color: "white",
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonPrimary: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#3FC1C9",
    },
    buttonPressed: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#AFAFAF",
    },
    buttonSecondary: {
        width: 140,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        borderWidth: 0,
        backgroundColor: "#FC5185",
    },
    nameInput: {
        height: 50,
        paddingHorizontal: 10,
        borderColor: "#2f2b3a",
        borderWidth: 1,
        borderRadius: 5,
        color: "gray",
    },
    deviceListItemText: {
        color: "white",
    }
})
