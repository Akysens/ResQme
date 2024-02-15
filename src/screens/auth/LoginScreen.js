import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@firebaseConfig'; 

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  let validLogin = true;

  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.warn(error);
      validLogin = false;
      setErrorMsg("Error. Invalid credentials");
    } finally {
      setLoading(false);
    }

    if (validLogin) {
      // if (mode == "SAR") {
        navigation.navigate('SAR_Team_Screen');
    // }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>HelpHub</Text>
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
});

export default LoginScreen;
