// React
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// UI
import { SafeAreaView, View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeButton } from "react-native-expo-swipe-button";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SegmentedButtons, Banner, Text, Button } from "react-native-paper";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";

// State
import { useStoreState, useStoreActions } from "easy-peasy";
import NetInfo from "@react-native-community/netinfo";

import * as Nearby from "../../../../modules/helphub-nearby/index";

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

function NearbyDevice({endpointName, endpointId, setSelected}) {
    
    [isConnected, setIsConnected] = useState(false);

    return (
        <Menu>
            <MenuTrigger>
                <View style={styles.deviceListItem}>
                    <Text style={styles.deviceListItemText}>{endpointName}</Text>
                    <Text style={styles.deviceListItemText}>{endpointId}</Text>
                </View>
            </MenuTrigger>
            <MenuOptions>
                {
                    isConnected ? 
                        (<MenuOption text="Connect" onSelect={() => alert("test") }/>)
                            : 
                        (   
                            <>
                                <MenuOption text="Disconnect" onSelect={() => alert("test") }/>
                                <MenuOption text="Message" onSelect={() => alert("test") }/>
                            </>
                        )
                }
                
            </MenuOptions>
        </Menu>
    );
}

export default function OfflineMode() {
    [discoveredDevices, setDiscoveredDevices] = useState(null);
    [userName, setUserName] = useState("HelphubUser");
    [warned, setWarned] = useState(false);
    [advertising, setAdvertising] = useState(false);
    [discovering, setDiscovering] = useState(false);
    [selected, setSelected] = useState(null);

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
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <Text style={styles.header}>Offline Mode</Text>
                <View style={styles.deviceList}>
                    <FlatList 
                        renderItem={({item}) => {
                            return <NearbyDevice endpointId={item.id} endpointName={item.name} setSelected={setSelected}/>;
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
