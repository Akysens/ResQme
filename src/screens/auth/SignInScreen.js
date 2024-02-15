import React, { useState } from "react";
import { useStoreActions } from "easy-peasy";
import { View, StyleSheet, Text } from "react-native";
import { Button, TextInput, HelperText } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@firebaseConfig";

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPassword] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");
  const [error, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const setUser = useStoreActions((actions) => actions.setUser);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );

      const id = userCredential.user.uid;

      const user = {
        name,
        email,
        id,
        phoneNum,
        mode: "victim"
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);
      setUser(user);
      // if (user.mode == "victim") {
      //   navigation.navigate("Victim_Screen");
      // }
      // else {
      //   navigation.navigate("SAR_Team_Screen");
      // }
      
      navigation.navigate("SAR_Team_Screen");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrMsg("Email already in use !");
      } else if (error.code === "auth/invalid-email") {
        setErrMsg("Invalid Email !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.title}>HelpHub</Text>
        <View>
          <HelperText
            type="error"
            visible={error !== null}
            style={{
              display: error !== null ? "flex" : "none",
            }}
          >
            {error}
          </HelperText>
        </View>
        <TextInput
            mode={"outlined"}
            label={"Email"}
            onChangeText={(input) => setEmail(input)}
            value={email}
            style={style.input}
          />
          
        <TextInput
          mode={"outlined"}
          style={style.input}
          label={"Password"}
          secureTextEntry={true}
          onChangeText={(input) => setPassword(input)}
          value={pass}
        />
        <TextInput
          mode={"outlined"}
          label={"Name"}
          style={style.input}
          onChangeText={(input) => setName(input)}
          value={name}
        />
        <TextInput
          label={"Phone Number"}
          mode={"outlined"}
          style={style.input}
          keyboardType="numeric"
          onChangeText={(number) => setPhoneNumber(number)}
          value={phoneNum}
          maxLength={15}
        />
        <Button
          style={style.signInButton}
          onPress={handleSignUp}
          mode="contained"
          icon="login"
          loading={loading}
        >
          Sign Up !
        </Button>
      <View style={style.signupButton}>
        <Button
          onPress={() => navigation.navigate("Login_Screen")}
          style={{
            marginTop: 30,
          }}
        >
          Already have an account? Login
        </Button>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  signInView: {
    padding: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButton: {
    marginTop: 20,
    alignSelf: "flex-right",
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '85%',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: '#0066cc',
  },
  error: {
    color: 'red',
  }
});
