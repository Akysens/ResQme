import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function UploadImage() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    checkForPermissions();
  }, []);

  const checkForPermissions = async () => {
    const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraRollStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
      alert("Please grant camera and gallery permissions inside your system's settings");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri); // Log the URI directly from the result
    }
  };
  
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri); // Log the URI directly from the result
    }
  };
  

  const showImagePicker = () => {
    Alert.alert("Upload Image", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: pickImage },
      { text: "Cancel" }
    ]);
  };

  return (
    <View style={imageUploaderStyles.container}>
      {image && <Image source={{ uri: image }} style={ imageUploaderStyles.image } />}
      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity onPress={showImagePicker} style={imageUploaderStyles.uploadBtn}>
          <Text>{image ? 'Edit' : 'Upload'} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: '#efefef',
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
    flex: 1,
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '25%',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: "center",
    justifyContent: 'center',
  },
  image: {
    width: '100%', // Make the image fill the entire width of the circular container
    height: '100%', // Make the image fill the entire height of the circular container
  },
});