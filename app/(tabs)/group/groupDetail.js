import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native";
import ContactPicker from "../../permission/ContactPicker";

const GroupDetailsScreen = () => {
  const router = useRouter();
  const { groupId, groupName, currentUser } = useLocalSearchParams();

  //alert(grouPName, currentUser);

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/homeScreen")}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {/* Group Icon & Name */}
      <View style={styles.groupHeader}>
        {/*<Image source={require("../assets/group-icon.png")} style={styles.groupIcon} />*/}
        <Text style={styles.groupname}>{groupName}</Text>
        <Text style={styles.noExpensesText}>No expenses here yet.</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Settle up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <FontAwesome5 name="gem" size={16} color="#80CBC4" />
          <Text style={styles.actionText}>Charts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Balances</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Options */} 
      <View>
        <Text style={styles.onlyOneText}>You're the only one here!</Text>
        {/* <TouchableOpacity style={styles.inviteOption} onPress={() => router.push("/group/addMemberToGroup")}>
          <Ionicons name="person-add-outline" size={22} color="#80CBC4" />
          <Text style={styles.inviteText}>Add group members</Text>
        </TouchableOpacity>*/} 
        <SafeAreaView>
          <ContactPicker groupId={groupId} groupName={groupName} currentUser={currentUser} />
        </SafeAreaView>
        <TouchableOpacity style={styles.inviteOption}>
          <Ionicons name="link-outline" size={22} color="#80CBC4" />
          <Text style={styles.inviteText}>Share group link</Text>
        </TouchableOpacity>
      </View>



      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="receipt-long" size={28} color="black" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/homeScreen")}>
          <Ionicons name="people" size={24} color="#1DB954" />
          <Text style={styles.navTextActive}>Groups</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="white" />
          <Text style={styles.navText}>Friends</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="bar-chart" size={24} color="white" />
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/accountScreen")}>
          <Ionicons name="person-circle" size={24} color="white" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  groupHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  groupIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#1C1C1E",
    marginBottom: 10,
  },
  groupname: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  noExpensesText: {
    color: "#B0BEC5",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#1C1C1E",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    color: "white",
    fontSize: 14,
    marginLeft: 6,
  },
  onlyOneText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  inviteOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  inviteText: {
    color: "#80CBC4",
    fontSize: 16,
    marginLeft: 10,
  },
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    backgroundColor: "#80CBC4",
    padding: 16,
    borderRadius: 50,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1C1C1E",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

export default GroupDetailsScreen;
