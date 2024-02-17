import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';


function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const userCreds = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user profile data using userCreds.user.uid
      const userDoc = doc(db, "users", userCreds.user.uid); // Assuming 'users' is your collection
      const userProfile = await getDoc(userDoc);
  
      if (userProfile.exists()) {
        const userData = userProfile.data();
        // Check the user's mode and navigate accordingly
        if (userData.mode === "victim") {
          navigation.navigate("Volunteer_Screen");
        } else {
          navigation.navigate("SAR_Screen");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.warn(error);
      setErrorMsg("Error. Invalid credentials");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("@assets/logo.png")} style={styles.logo} />
      {/* <Text style={styles.title}>HelpHub</Text> */}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={loading}
      >
        Log in
      </Button>
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp_Screen')}
        style={styles.signupButton}
      >
        <Text style={styles.signupButtonText}>Need an account?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    width: '80%',
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
  },
  logo: {
    width: 250,
    height: 250,
  },
});

export default LoginScreen;
