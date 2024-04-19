import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  PhotoFile,
} from "react-native-vision-camera";
import { MaterialIcons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [flash, setFlash] = useState(false);
  const device = useCameraDevice("back", {
    physicalDevices: ["wide-angle-camera"],
  });
  const { hasPermission, requestPermission } = useCameraPermission();
  const [permission, setPermission] = useState<null | boolean>();

  const [photo, setPhoto] = useState<PhotoFile | null | undefined>(null);

  const cameraRef = useRef<Camera>(null);

  async function onTakePicture() {
    console.log("onTakePicture");
    if (!cameraRef.current) {
      Alert.alert("Camera Error", "Camera not ready");
      return;
    }

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: flash ? "on" : "off",
      });
      console.log(photo);
      setPhoto(photo);
    } catch (error) {
      console.error(error);
      Alert.alert("Error Taking Picture", "Failed to take picture");
    }
  }

  useEffect(() => {
    (async () => {
      const cameraStatus = await requestPermission();
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      if (cameraStatus && mediaStatus.status === "granted") {
        setPermission(true);
      } else {
        setPermission(false);
        Alert.alert(
          "Permission error",
          "You need to allow camera and media library access."
        );
      }
    })();
  }, []);

  if (!permission)
    return (
      <View style={{ flex: 1 }}>
        <Text>Permission not granted</Text>
      </View>
    );

  if (!device)
    return (
      <View style={{ flex: 1 }}>
        <Text>No device available</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {photo?.path ? (
        <View style={StyleSheet.absoluteFill}>
          <Image source={{ uri: photo.path }} />
          <TouchableOpacity onPress={() => setPhoto(undefined)}>
            <MaterialIcons name="close" size={32} color="#3182CE" />
          </TouchableOpacity>
        </View>
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          ref={cameraRef}
          device={device!}
          isActive={true}
          resizeMode="cover"
          photo={true}
          torch={flash ? "on" : "off"}
        />
      )}

      <Button title="foto" onPress={onTakePicture}></Button>
    </View>
  );
}
