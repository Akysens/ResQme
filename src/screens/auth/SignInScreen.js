import React, { useState } from "react";
import { useStoreActions } from "easy-peasy";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, HelperText, Checkbox } from "react-native-paper";
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
  const [isRescuer, setIsRescuer] = useState(false);
  const setUser = useStoreActions((actions) => actions.setUser);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const id = userCredential.user.uid;
      const user = {
        name,
        email,
        id,
        phoneNum,
        mode: isRescuer ? "rescuer" : "victim",
      };

      // Add to users collection
      await setDoc(doc(collection(db, "users"), id), user);
      setUser(user);

      navigation.navigate("Login_Screen");
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
      <Image source={require('@assets/logo.png')} style={style.logo} />
      {/* <Text style={style.title}>HelpHub</Text> */}
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

      <View style={{ flexDirection: 'row', 
      alignItems: 'center',
      marginVertical: 10}}>
        <Text style={style.TextInput}>Please check this if you are a rescuer</Text>
        <Checkbox
          status={isRescuer ? 'checked' : 'unchecked'}
          onPress={() => {
            setIsRescuer(!isRescuer);
          }}
        />
      </View>

      <Button
        style={style.signInButton}
        onPress={handleSignUp}
        mode="contained"
        loading={loading}
      >
        Sign Up
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login_Screen')}
        style={style.signupButton}
      >
        <Text style={style.signupButtonText}>Already have an account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  // title: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#000',
  //   marginBottom: 40,
  // },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#6200ee',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  loginText: {
    marginTop: 20,
    color: '#000',
  },
  loginClickableText: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
  logo: {
    width: 250,
    height: 250,
  },
  signupButton: {
    marginTop: 20,
  },
  signupButtonText: {
    color: '#0066cc',
  },
});