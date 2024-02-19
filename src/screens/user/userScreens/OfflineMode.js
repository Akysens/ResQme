// React
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

// UI
import { Text, SafeAreaView, View, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SwipeButton } from "react-native-expo-swipe-button";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { SegmentedButtons, Banner, Text, Button } from "react-native-paper";

import Map from "../components/Map";
import VictimDetail from "../components/VictimDetail";
import MapMarker from "../components/MapMarker";

// Map
import { Heatmap } from "react-native-maps";

// State
import { useStoreState, useStoreActions } from "easy-peasy";

// Firebase
import { rdb } from "@firebaseConfig";
import { ref, get } from "firebase/database";

// Utils
import { randFullName } from "@ngneat/falso";
import { isEmpty, values } from "lodash";
import { randPhoneNumber, randNumber, randBetweenDate } from "@ngneat/falso";
import { DateTime } from "luxon";
import { useIsFocused } from "@react-navigation/native";
import { sendLocation } from "@utils";
import * as Nearby from "../../../../modules/helphub-nearby/index";

export default function OfflineMode() {
    return (
        <View>
            <Text>hello world</Text>
        </View>
    )
}