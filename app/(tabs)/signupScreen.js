import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; 

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system"; // Ensure you import this

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebaseConfig"; // ✅ Import your Firebase config


export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*const validateForm = () => {
    if (!phone && (!email || !password)) {
      setError("Either phone number or email with password is required");
      return false;
    }

    if (password && password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (phone && phone.length !== 10) {
      setError("Please enter a valid phone number");
      return false;
    }

    return true;
  };*/

  const uploadImage = async (uri) => {
    if (!uri) return null;
  
    try {
      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();
  
      // Define file path in Firebase Storage
      const filename = `profileImages/${Date.now()}.jpg`;
      const storageRef = ref(storage, filename);
  
      // Upload to Firebase
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
  
      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Image Upload Error:", error);
      throw error;
    }
  };
  //profileImage: imageUrl add this body for image upload
  const handleSignup = async () => {
    setLoading(true);
    setError(""); // Clear any previous errors
    try {
      console.log(1);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(2);
      // Upload profile image if available
      //let groupImage = profileImage ? await uploadImage(profileImage) : null;

      // Store user data in Firestore (optional)
      /*const userData = {
        fullName,
        email,
        phone,
        uid: user.uid,
        //profileImage: imageUrl,
      };*/
      

      //Update user's displayName in Firebase Auth
      /*await updateProfile(user, {
        displayName: fullName, // Set the full name
        // groupImage: imageUrl, // Uncomment if you want to set the profile picture
      });
      
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        phone,
        uid: user.uid,
        createdAt: new Date(), // Store timestamp
      });*/

      updateProfile(user, { displayName: fullName }),
      setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        phoneNumber,
        password,
        uid: user.uid,
        currency:"INR",
        groupImage: imageUrl || null,
        createdAt: new Date(),
      })
      console.log(3);

      router.push("/LoginScreen"); // Navigate to login
      console.log(4);
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign up</Text>

      {/* Full Name */}
      <View style={styles.inputContainer}>  
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
        {fullName ? (
          <TouchableOpacity onPress={() => setFullName("")}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        ) : null}
      </View> 

      {/* Profile Image */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <MaterialCommunityIcons name="camera-plus" size={32} color="white" />
        )}
      </TouchableOpacity>

      {/* Email */}
      <View style={styles.inputEmailContainer}>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      </View>

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <MaterialCommunityIcons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>Minimum 8 characters</Text>

      {/* Phone Input */}
      <View style={styles.phoneContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryText}>🇮🇳 +91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone number"
          placeholderTextColor="#888"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      {/* Currency Info */}
      <Text style={styles.currencyText}>
        I use <Text style={{ fontWeight: "bold" }}>INR (₹)</Text> as my currency.{" "}
        <Text style={styles.changeText}>Change »</Text>
      </Text>

      {/* Terms */}
      <Text style={styles.termsText}>
        By signing up, you accept the DiviPay{" "}
        <Text style={styles.linkText}>Terms of Service</Text> and{" "}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>

      {/* Done Button */}
      <TouchableOpacity  
        style={[styles.doneButton, loading && styles.disabledButton]} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.doneButtonText}>
          {loading ? "Creating Account..." : "Done"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: "75%"
  },
  inputEmailContainer:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 15,
    width: 30
  },
  imagePicker: {
    alignSelf: "flex-end",
    marginTop: -75,
    marginRight: 0,
    marginBottom: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 50,
    padding: 5,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 15,
  },
  helperText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 20,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  countryCode: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  countryText: {
    color: "white",
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  currencyText: {
    color: "white",
    fontSize: 16,
    marginBottom: 20,
  },
  changeText: {
    color: "#1DB954",
    fontSize: 16,
  },
  termsText: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  linkText: {
    color: "#1DB954",
  },
  doneButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#1DB95480',
  },
};


/*import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        friends: [],
      });

      router.replace("/homeScreen");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Signup" onPress={handleSignup} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}*/

// Add these new styles
/*const additionalStyles = StyleSheet.create({
  
});

// Merge the new styles with existing styles
const styles = StyleSheet.create({
  ...existingStyles,
  ...additionalStyles,
});
*/