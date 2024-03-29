import { View, StyleSheet, Alert, FlatList, Pressable, TextInput, Animated } from "react-native";
import { Text } from "react-native-paper";
import * as Colors from "../../styles/Colors"
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function EmergencyBagButton({onPress}) {
    return (
        <Pressable onPressOut={onPress}>
            <LinearGradient 
            colors={[Colors.purple, Colors.pink]}
            style={styles.container}>
                <Icon name="medical-services" size={20} color="white"/>
            </LinearGradient>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 20,
    },
});
