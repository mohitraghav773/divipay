import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
//import { signInWithGoogle } from "../utils/auth"; // Implement Firebase auth logic
//import { signInWithEmailAndPassword } from "firebase/auth";
//import { auth } from "../firebaseConfig";
//import { signInWithGoogle } from '../auth/googleAuthService';;




import * as WebBrowser from "expo-web-browser";
import * as AuthSession from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import { useGoogleAuth, googleConfig } from "../auth/googleAuthConfig";


export default function LoginScreen() {
  const router = useRouter();
  //const { user, promptAsync } = useGoogleAuth();

  const [user, setUser] = useState(null);

  // Configure Google authentication
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "323161333268-jm0ti9l2k8n2bdodm24gvvabrnm0f25f.apps.googleusercontent.com", 
    androidClientId: "323161333268-jm0ti9l2k8n2bdodm24gvvabrnm0f25f.apps.googleusercontent.com", 
    iosClientId: "323161333268-118h86i3embjp9lar7no179c8ti41crh.apps.googleusercontent.com",
  });

  // Handle login response
  useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response?.authentication?.accessToken);
    }
  }, [response]);

  // Fetch user info from Google API
  const fetchUserInfo = async (token: any) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await res.json();
      setUser(userInfo);
      //if (onLoginSuccess) onLoginSuccess(userInfo);
    } catch (error: any) {
      console.error("Failed to fetch user info:", error);
    }
  };

  /*const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('User Info:', user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };*/

  return (
    <View style={styles.container}>
      {/* Logo */}
      {/* <Image source={require("../assets/logo.png")} style={styles.logo} /> */}
      <Text style={styles.appName}>DiviPay</Text>

      {/* Buttons */}
      <TouchableOpacity style={styles.signupButton} onPress={() => router.push("/signupScreen")}>
        <Text style={styles.signupText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/LoginScreen")}>
        <Text style={styles.loginText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        {/*<Image source={require("../assets/google-icon}.png")} style={styles.googleIcon} />*/}
        {/*<Text style={styles.googleText}>Sign in with Google</Text>*/}
        {user ? (
          <Text>Welcome, {user['name']}</Text>
        ) : (
          <Text style={styles.googleText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.seperatorIndex}>Or</Text>

      <TouchableOpacity style={styles.googleButton} >
        {/*<Image source={require("../assets/google-icon}.png")} style={styles.googleIcon} />*/}
        <Text style={styles.googleText}>Enter Mobile Number</Text> 
      </TouchableOpacity>

      {/* Footer Links */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Terms</Text>
        <Text style={styles.footerText}>|</Text>
        <Text style={styles.footerText}>Privacy Policy</Text>
        <Text style={styles.footerText}>|</Text>
        <Text style={styles.footerText}>Contact us</Text>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  seperatorIndex:{
    fontSize: 14,
    color: "#fff",
    paddingBottom: 30,
    paddingTop:30,
  },
  signupButton: {
    width: "80%",
    backgroundColor: "#1DB954",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  signupText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  loginButton: {
    width: "80%",
    borderColor: "#1DB954",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  loginText: {
    fontSize: 16,
    color: "#fff",
  },
  googleButton: {
    flexDirection: "row",
    width: "80%",
    borderColor: "#fff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    color: "#ccc",
    marginHorizontal: 5,
  },
});

/*import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("./homeScreen");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      <Button title="Signup" onPress={() => router.push("./signupScreen")} />
    </View>
  );
}*/






/*import { Image, StyleSheet, Platform } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { View, TextInput, Button, Text } from "react-native";
import { useState } from 'react';



import { db, auth } from "../firebaseConfig"; // Import Firestore instance
import { collection, addDoc, query, where } from "firebase/firestore";
import { signUp, login, logout } from "../authService";
import { User, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function HomeScreen() {
  const [email, setEmail] = useState("mohit.raghav773@gmail.com");
  const [password, setPassword] = useState("Mohit29");
  const [name, setName] = useState("");
  const [user, setUser] = useState();

  const handleSignUp = async () => {
    try {
      const newUser: User = await signUp(email, password, name);
      setUser(newUser);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleLogin = async () => {
    const testEmail = "mohit.raghav773@gmail.com";
    const testPassword = "Mohit29081991";

    setEmail("mohit.raghav773@gmail.com")
    setPassword("Mohit29")


    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Get Firebase Token
      const firebaseToken = await user.getIdToken(true);  // 👈 Force refresh
      console.log(firebaseToken)
      // Send it to Backend for JWT Generation
      //http://192.168.31.49:5000/generate-token
      const response = await fetch("http://192.168.31.49:5000/generate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firebaseToken })
        
      });
      
      const data = await response.json();
      //alert(data);
      //alert(data.jwtToken);
      alert('Logged in')
    } catch (error: any) {
      console.error(error.message);
      alert(password)
      alert(email)
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const addUserAutoId = async (name:string, email:string) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        balance: 0,
        createdAt: new Date(),
      });
      console.log("User added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };


  const createGroup = async (groupName:string, memberIds:string[]) => {
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        members: memberIds, // Array of user IDs
        createdAt: new Date(),
      });
      console.log("Group created with ID:", docRef.id);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };


  const addExpense = async (groupId:string, description:string, amount:number, paidBy:string, splitAmong:string[]) => {
    try {
      const docRef = await addDoc(collection(db, "expenses"), {
        groupId: groupId,
        description: description,
        amount: amount,
        paidBy: paidBy,
        splitAmong: splitAmong,
        createdAt: new Date(),
      });
      console.log("Expense added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={{ padding: 20 }}>
        {user ? (
          <>
            <Text>Welcome, {user["email"]}</Text>
            <Button title="Logout" onPress={handleLogout} />
          </>
        ) : (
          <>
            <TextInput placeholder="Name" onChangeText={setName} />
            <TextInput placeholder="Email" onChangeText={setEmail} />
            <TextInput placeholder="Password" onChangeText={setPassword} secureTextEntry />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Login" onPress={handleLogin} />
          </>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});*/

