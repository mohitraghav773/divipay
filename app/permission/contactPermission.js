// permissions.js
import { PermissionsAndroid, Platform } from "react-native";

export const requestContactsPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: "Contacts Permission",
          message: "This app needs access to your contacts to add group members.",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission request failed:", err);
      return false;
    }
  }
  return true; // iOS handles permissions automatically
};
