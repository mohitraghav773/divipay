import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig"; // ✅ Import your Firebase config
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      if (!auth) {
        Alert.alert("Firebase Auth is not initialized properly.");
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
      }     
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get Firebase ID Token
      const idToken = await user.getIdToken();
      //console.log("ID Token:", idToken);

      // Send Token to Backend
      await fetch("http://192.168.1.3:5000/protected", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })
      .then(async (res) => {
        const text = await res.text(); // Get response as text
        try {
          const data = JSON.parse(text); // Try parsing JSON
          console.log("Protected Data:", data);
        } catch (error) {
          console.error("JSON Parse Error:", error);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
      router.push("/homeScreen"); // Redirect to Home
    } catch (error) {
      console.error("Login Error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Log in</Text>

      {/* Email Input */}
      <Text style={styles.label}>Email address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter password"
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

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
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
  label: {
    color: "#ccc",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#1C1C1E",
    color: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 15,
  },
  loginButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#80D0C7",
    fontSize: 16,
    textAlign: "center",
  },
};
