import React, { useState } from "react";
import { useStoreActions } from "easy-peasy";
import { StyleSheet, Image, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@firebaseConfig";

export default function Medical_Screen({ route, navigation }) {
  const { id } = route.params;
  const [BloodType, setBloodType] = useState("");
  const [EmergencyContactEmail, setEmergencyContactEmail] = useState("");
  const [EmergencyContactName, setEmergencyContactName] = useState("");
  const [EmergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [Gender, setGender] = useState("");
  const [Height, setHeight] = useState("");
  const [Weight, setWeight] = useState("");
  const [Loading, setLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ["Male", "Female", "Other", "Rather not say"];

  const setUser = useStoreActions((a) => a.setUser);

  const user = {
    BloodType,
    EmergencyContactEmail,
    EmergencyContactName,
    EmergencyContactNumber,
    Gender,
    Height,
    Weight,
  };

  const setMedicalInfo = async () => {
    try {
      setLoading(true);
      await setDoc(doc(collection(db, "usersMedicalInfo"), id), user);
      setUser(user);
      navigation.navigate("Login_Screen");
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const renderPickerItems = (data) => {
    return data.map((item, index) => (
      <Picker.Item key={index} label={item} value={item} />
    ));
  };

  return (
    <SafeAreaView style={style.container}>
      <Image source={require("@assets/logo.png")} style={style.logo} />

      <View>
        <Text style={style.label}>Blood Type</Text>
        <View style={style.pickerBox}>
          <Picker
            selectedValue={BloodType}
            onValueChange={(itemValue) => setBloodType(itemValue)}
            style={style.input}
          >
            {renderPickerItems(bloodTypes)}
          </Picker>
        </View>
      </View>

			<View>
				<Text style={style.label}>Emergency Contact Information</Text>
				<TextInput
					mode={"outlined"}
					label={"Emergency Contact Name"}
					onChangeText={(name) => setEmergencyContactName(name)}
					value={EmergencyContactName}
					style={style.input}
				/>

				<TextInput
						mode={"outlined"}
						label={"Emergency Contact Number"}
						onChangeText={(number) => setEmergencyContactNumber(number)}
						value={EmergencyContactNumber}
						style={style.input}
					/>

				<TextInput
						mode={"outlined"}
						label={"Emergency Contact Email"}
						onChangeText={(email) => setEmergencyContactEmail(email)}
						value={EmergencyContactEmail}
						style={style.input}
					/>
				</View>

			<View>
        <Text style={style.label}>Gender</Text>
        <View style={style.pickerBox}>
          <Picker
            selectedValue={Gender}
            onValueChange={(gender) => setGender(gender)}
            style={style.input}
          >
            {renderPickerItems(genders)}
          </Picker>
        </View>
      </View>

			<View style={style.inputContainer}>
				<Text style={style.label}>Physiological Information</Text>
				<TextInput
					mode={"outlined"}
					label={"Height (in cm)"}
					keyboardType="numeric"
					onChangeText={(height) => setHeight(height)}
					value={Height}
					style={style.input}
				/>

				<TextInput
					mode={"outlined"}
					label={"Weight (in kg)"}
					keyboardType="numeric"
					onChangeText={(weight) => setWeight(weight)}
					value={Weight}
					style={style.input}
				/>
			</View>

      <TouchableOpacity onPress={setMedicalInfo} style={style.button}>
        <Text style={style.signupButtonText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 15,
  },
  logo: {
    width: 100,
    height: 100,
		alignSelf: "center",
  },
  signupButton: {
    marginTop: 10,
    backgroundColor: "#0066cc",
    padding: 15,
    borderRadius: 5,
  },
  signupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  input: {
    backgroundColor: "#fff",
    padding: 5,
    fontSize: 15,
	},
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
    fontWeight: "bold",
		marginTop: 10,
  },
  pickerBox: {
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderRadius: 5,
		marginTop: 5,
  },
	signupButtonText: {
    color: '#fff',
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
});
