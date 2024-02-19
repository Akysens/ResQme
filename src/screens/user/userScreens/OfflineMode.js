// React
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// UI
import { SafeAreaView, View, StyleSheet, Alert } from "react-native";
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

    useEffect(() => {
    }, [])

    return (
        <View style={styles.container}>
            <Text>hello world</Text>
        </View>
    )

    navigation.na
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
    },
})