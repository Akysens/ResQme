// React
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// UI
import { SafeAreaView, View, StyleSheet, Alert, FlatList, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeButton } from "react-native-expo-swipe-button";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SegmentedButtons, Banner, Text, Button } from "react-native-paper";

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

function NearbyDevice({endpointId}) {
    return (
        <View style={styles.deviceListItem}>
            <Text>{endpointId}</Text>
        </View>
    );
}

export default function OfflineMode() {
    [discoveredDevices, setDiscoveredDevices] = useState([null])

    Alert.alert(
        "No internet connection!",
        "App will now switch to offline mode."
    );

    // const navigation = useNavigation();

    const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isInternetReachable === true) {
            Alert.alert(
                "Internet found!",
                "App will now switch to normal mode"
            )

            // navigation.navigate("Login_Screen");
        }
    });

    const onNewDeviceDiscovered = Nearby.addDeviceDiscoveryListener((event) => {
        console.log(event.endpointId);
        console.log(event.endpointName);

        setDiscoveredDevices(Nearby.getDiscoveredEndpoints());
    })

    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <Text style={styles.header}>Offline Mode</Text>
                <View style={styles.deviceList}>
                    <FlatList 
                        renderItem={({item}) => <NearbyDevice endpointId={item} />}
                        data={discoveredDevices}
                    >
                    </FlatList>
                </View>
                <View style={styles.buttonContainer}>
                    <NewButton primary={true}
                        onPress={() => Nearby.startDiscovery("test")}>
                        <Text>Discover</Text>
                    </NewButton>
                    <NewButton primary={true}
                        onPress={() => Nearby.startAdvertising("test")}>
                        <Text>Advertise</Text>
                    </NewButton>
                </View>
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
})
