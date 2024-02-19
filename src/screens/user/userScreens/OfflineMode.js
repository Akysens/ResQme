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

export default function OfflineMode() {
    Alert.alert(
        "No internet connection!",
        "App will now switch to offline mode."
    );

    const navigation = useNavigation();

    const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isInternetReachable === true) {
            Alert.alert(
                "Internet found!",
                "App will now switch to normal mode"
            )

            navigation.navigate("Login_Screen");
        }
    });

    return (
        <View style={styles.container}>
            <View style={styles.safeArea}>
                <Text style={styles.header}>Offline Mode</Text>
                <FlatList style={styles.deviceList}>
                    <View style={styles.deviceListItem}>
                        <Text>a</Text>
                    </View>
                </FlatList>
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
    },
    deviceListItem: {
        margin: 10,
        backgroundColor: "#46424f",
        borderColor: "#2f2b3a",
        borderWidth: 1,
        borderCurve: 5,
        width: "100%",
        height: 50,
    }
})
