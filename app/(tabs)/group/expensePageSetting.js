import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, Image, FlatList, ScrollView } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native";
import ContactPicker from "../../permission/ContactPicker";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Adjust the import path as needed

const GroupData= [
  {
    "createdAt": {
      "nanoseconds": 638000000, 
      "seconds": 1742393306
    }, 
    "createdBy": "4v6Syi6qh8aQhXlML3dVxPpf9yI3", 
    "groupName": "Test 01", 
    "groupType": "1", 
    "members": [
      {
        "email": "test.user3@gmail.com", 
        "name": "Test user 3", 
        "userId": "4v6Syi6qh8aQhXlML3dVxPpf9yI3"
      }, 
      {
        "name": "Amaar Sapient", 
        "phoneNumber": "+91 73553 19830", 
        "userId": "277"
      }
    ]
  } 
]


const GroupSettingsScreen = () => {
  const router = useRouter();
  const [groupData, setGroupData] = useState([]);
  const [simplifyDebts, setSimplifyDebts] = useState(false);
  const { groupId, groupName, currentUser } = useLocalSearchParams();

  const getGroupDetails = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId); // Reference to the document
      const groupSnap = await getDoc(groupRef); // Fetch document
      
      if (groupSnap.exists()) {
        setGroupData(groupSnap.data())
        //console.log("Group Data:", groupSnap.data());
        console.log("test", groupData.members)
        return groupSnap.data(); // Return the group details
      } else {
        console.log("No such group!"); 
        return null;
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      return null;
    }  
  };

  useEffect(() => {
    getGroupDetails(groupId);
  }, [groupId]);



  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group settings</Text>
      </View>

      {/* Group Info */}
      <View style={styles.groupInfo}>
        {/*<Image source={require("./assets/household.png")} style={styles.groupIcon} />*/}
        <View style={{ flex: 1 }}>
          <Text style={styles.groupName}>Household</Text>
          <Text style={styles.groupSubtitle}>Home</Text>
        </View>
        <TouchableOpacity>
          <MaterialIcons name="edit" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Group Members */}
      <Text style={styles.sectionTitle}>Group members</Text>
      <TouchableOpacity style={styles.listItem}>
        {/* <Ionicons name="person-add" size={24} color="white" />
        <Text style={styles.listText}>Add people to group</Text>*/}
        <SafeAreaView>
          <ContactPicker groupId={groupId} groupName={groupName} currentUser={currentUser} />
        </SafeAreaView>
      </TouchableOpacity>

      {/* Members */}
      <View style={styles.memberItem}>
        <FlatList
          data={groupData.members}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => {}}>  
              <View style={styles.memberItem}>
                <View style={styles.memberAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberEmail}>{item.email || item.phoneNumber}</Text>
                </View>
                <Text style={styles.owesText}>owes</Text>
                <Text style={styles.owesAmount}>$1,09,652.50</Text>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </View>
        


      {/*<View style={styles.memberItem}>
        <View style={styles.memberAvatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>Ishita Kaushik</Text>
          <Text style={styles.memberEmail}>ishitakaushik@icloud.com</Text>
        </View>
        <Text style={styles.owesText}>owes</Text>
        <Text style={styles.owesAmount}>$1,09,652.50</Text>
      </View>

      <View style={styles.memberItem}>
        <View style={[styles.memberAvatar, { backgroundColor: "#FF5733" }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.memberName}>Mohit Sapient</Text>
          <Text style={styles.memberEmail}>mohit.raghav773@gmail.com</Text>
        </View>
        <Text style={styles.getsBackText}>gets back</Text>
        <Text style={styles.getsBackAmount}>$1,09,652.50</Text>
      </View>*/}

      <TouchableOpacity style={styles.listItem}>
        <Ionicons name="link-outline" size={24} color="white" />
        <Text style={styles.listText}>Invite via link</Text>
      </TouchableOpacity>
      

      {/* Advanced Settings */}
      <Text style={styles.sectionTitle}>Advanced settings</Text>
      <View style={styles.listItem}>
        <Ionicons name="shuffle-outline" size={24} color="white" />
        <View style={{ flex: 1 }}>
          <Text style={styles.listText}>Simplify group debts</Text>
          <Text style={styles.listSubText}>Automatically combines debts to reduce repayments.</Text>
        </View>
        <Switch value={simplifyDebts} onValueChange={() => setSimplifyDebts(!simplifyDebts)} />
      </View>
      
      {/* Default Split
      <View style={styles.listItem}>
        <View style={styles.splitIcon}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>=</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.listText}>
            Default split <Text style={styles.proBadge}>PRO</Text>
          </Text>
          <Text style={styles.listSubText}>Paid by you and split equally</Text>
        </View>
      </View>*/}

      {/* Leave & Delete Group Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.leaveButton}>
          <Ionicons name="exit-outline" size={22} color="#E57373" />
          <Text style={styles.leaveText}>Leave group</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#E57373" />
          <Text style={styles.leaveText}>Delete group</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", paddingHorizontal: 15 },
  header: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  headerTitle: { fontSize: 22, color: "white", fontWeight: "bold", marginLeft: 15 },
  groupInfo: { flexDirection: "row", alignItems: "center", paddingVertical: 15 },
  groupIcon: { width: 50, height: 50, borderRadius: 10, backgroundColor: "#2C3E50", marginRight: 10 },
  groupName: { fontSize: 18, color: "white", fontWeight: "bold" },
  groupSubtitle: { color: "#bbb", fontSize: 14 },
  sectionTitle: { color: "#bbb", fontSize: 16, marginTop: 20, marginBottom: 10 },
  listItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  listText: { color: "white", fontSize: 16, marginLeft: 10 },
  listSubText: { color: "#aaa", fontSize: 14, marginLeft: 10 },
  memberItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#34495E", marginRight: 10 },
  memberName: { color: "white", fontSize: 16, fontWeight: "bold" },
  memberEmail: { color: "#aaa", fontSize: 14 },
  owesText: { color: "#E74C3C", fontSize: 14, marginRight: 5 },
  owesAmount: { color: "#E74C3C", fontSize: 16, fontWeight: "bold" },
  getsBackText: { color: "#2ECC71", fontSize: 14, marginRight: 5 },
  getsBackAmount: { color: "#2ECC71", fontSize: 16, fontWeight: "bold" },
  splitIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#8E44AD", alignItems: "center", justifyContent: "center", marginRight: 10 },
  proBadge: { backgroundColor: "#8E44AD", color: "white", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, fontSize: 12, fontWeight: "bold" },

    // Leave & Delete Buttons
  bottomButtons: { marginTop: 30, paddingBottom: 20 },
  leaveButton: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  deleteButton: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  leaveText: { color: "#E57373", fontSize: 16, marginLeft: 10 },
});

export default GroupSettingsScreen;
