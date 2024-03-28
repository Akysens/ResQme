import { View, StyleSheet, Alert, FlatList, Pressable, TextInput } from "react-native";
import * as Colors from "../styles/Colors";

/**
 * Button Component
 * Can become active (secondary) or inactive (primary).
 * 
 * primary: boolean     -> whether the button is a primary or a secondary button
 * childen: any         -> A react prop for supporting children components, such as text
 * onPress: function    -> Function to call on pressing the button.
 *  */
export default function Button({primary = true, children = null, onPress = null}) {
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


const styles = StyleSheet.create({
    buttonPrimary: {
        width: 130,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: Colors.purple,
        elevation: 5,
    },
    buttonPressed: {
        width: 130,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: Colors.darkgray,
        elevation: 5,
    },
    buttonSecondary: {
        width: 130,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 0,
        backgroundColor: Colors.magenta,
        elevation: 5,
    },
        buttonText: {
        fontFamily: "OpenSans",
        fontSize: 16,
        color: Colors.snow,
        fontWeight: 900,
    },
});
