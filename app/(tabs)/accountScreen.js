import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { auth } from "../firebaseConfig"; // Ensure this is correctly imported
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router"; // If using Expo Router

const AccountScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      router.replace("/"); // Redirect to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    setUserData(user);
    
    
    if (userData) {
      console.log("User Details", userData.displayName, userData.email, userData.uid);
    } else {
      console.log("No user found");
    }
         
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <Text style={styles.header}>Account</Text>

      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Avatar.Image size={70} source={{ uri: "https://via.placeholder.com/150" }} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userData && userData.displayName}</Text>
          <Text style={styles.email}>{userData && userData.email}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Divider style={styles.divider} />

      {/* Menu Options */}
      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="qrcode" size={22} color="white" />
        <Text style={styles.menuText}>Scan Code</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="diamond-stone" size={22} color="#a29bfe" />
        <Text style={styles.menuText}>DiviPay Pro</Text>
      </TouchableOpacity>

      <Divider style={styles.divider} />

      {/* Preferences */}
      <Text style={styles.sectionHeader}>Preferences</Text>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="email" size={22} color="white" />
        <Text style={styles.menuText}>Email Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="bell" size={22} color="white" />
        <Text style={styles.menuText}>Device and Push Notification Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="lock" size={22} color="white" />
        <Text style={styles.menuText}>Security</Text>
      </TouchableOpacity>

      <Divider style={styles.divider} />

      {/* Feedback */}
      <Text style={styles.sectionHeader}>Feedback</Text>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons name="star" size={22} color="white" />
        <Text style={styles.menuText}>Rate DiviPay</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.supportButton}>
        <Ionicons name="help-circle-outline" size={24} color="white" />
        <Text style={styles.supportText}>Contact DiviPay support</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={24} color="#1DB954" />
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ✨ in Providence, New Delhi, India</Text>
        <Text style={styles.footerText}>Copyright © 2025 DiviPay, Inc.</Text>

        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v0.0.1</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  contentContainer: { flexGrow: 1, paddingBottom: 30 },
  header: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  profileContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  profileInfo: { flex: 1, marginLeft: 15 },
  name: { fontSize: 18, fontWeight: "bold", color: "white" },
  email: { color: "#bbb", fontSize: 14 },
  divider: { backgroundColor: "#444", marginVertical: 15 },
  sectionHeader: { color: "#bbb", fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  menuText: { color: "white", fontSize: 16, marginLeft: 15 },
  supportButton: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  supportText: { color: "white", fontSize: 18, marginLeft: 10 },
  logoutButton: { flexDirection: "row", alignItems: "center", marginTop: 20, paddingVertical: 10 },
  logoutText: { color: "#1DB954", fontSize: 18, marginLeft: 10 },
  footer: { width: "100%", alignItems: "center", marginTop: 20, marginBottom:80 },
  footerText: { color: "#bbb", fontSize: 14, textAlign: "center" },
  footerLink: { color: "#A9E2A0", fontSize: 14, textAlign: "center", marginTop: 5 },
  highlight: { fontWeight: "bold", color: "#A9E2A0" },
  version: { color: "#888", fontSize: 14, marginTop: 10 },
});

export default AccountScreen;
