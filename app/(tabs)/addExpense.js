import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Make sure this is correctly configured

const AddExpenseScreen = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState("");
  const [participantsId, setParticipantsId] = useState("");
  const router = useRouter();
  const { groupId, groupName, currentUser } = useLocalSearchParams();
  //console.log('currentUser', auth.currentUser.uid) 
  //const [groupData, setGroupData] = useState([]); 

  const handleAddExpense = async () => {
    try {
      const expenseData = {
        groupId: groupId,  // Replace with actual groupId
        description,
        amount: parseFloat(amount),
        paidBy: auth.currentUser.uid,  // Replace with actual userId
        participants: participants, // Replace with selected participants
        splitType: "equally"
      };
      
      //console.log('expenseData', expenseData)
      const response = await fetch("http://192.168.1.3:5000/addExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });
  
      const result = await response.json();
      //console.log('result', result)
      if (response.ok) {
        router.push("/homeScreen");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
  
  const getGroupDetails = async (groupId) => {
    try {
      const groupRef = doc(db, "groups", groupId); // Reference to the document
      const groupSnap = await getDoc(groupRef); // Fetch document
      
      if (groupSnap.exists()) {

        setParticipants(groupSnap.data()?.members);
        //let newGroupData = groupSnap.data()?.members
          //.filter((item) => item.userId !== auth.currentUser.uid) 
          //.map((item) => item.userId);
          //setParticipantsId(newGroupData)
        //return newGroupData; // Return the group details
      } else {     
        console.log("No such group!"); 
        //return null;  
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
      return null;
    }  
  };

  useEffect(() => {  
    setParticipantsId(groupName);
    getGroupDetails(groupId)
  }, [groupId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add expense</Text>
        <TouchableOpacity onPress={handleAddExpense}>
          <Ionicons name="checkmark" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Participants Input */}
      <Text style={styles.participants}>
        <View style={styles.inputRow}>
          <Text style={{ fontWeight: "bold", color: "white", marginRight: 5 }}>With you and:</Text>
          <TextInput
            style={styles.inputParticipants}
            placeholder="Name, email, or phone..."
            placeholderTextColor="#aaa"
            value={participantsId}
            onChangeText={setParticipantsId}
          />
        </View>
      </Text>

      {/* Expense Details */}
      <View style={styles.expenseContainer}>
        {/* Description Input */}
        <View style={styles.inputRow}>
          <FontAwesome5 name="receipt" size={24} color="#ccc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter a description"
            placeholderTextColor="#aaa"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Amount Input */}
        <View style={styles.inputRow}>
          <FontAwesome5 name="dollar-sign" size={24} color="#ccc" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Payment Split Options */}
        <View style={styles.paymentOptions}>
          <Text style={styles.paymentText}>Paid by</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>you</Text>
          </TouchableOpacity>
          <Text style={styles.paymentText}>and split</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>equally</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation Bar */}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  participants: {
    color: "#B0BEC5",
    fontSize: 16,
    marginBottom: 20,
  },
  expenseContainer: {
    backgroundColor: "#1C1C1E",
    padding: 20,
    borderRadius: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 18,
    height:50,
    paddingVertical: 10,
  },
  inputParticipants: {
    flex: 1,
    color: "white",
    fontSize: 14,
    height:50,
    paddingVertical: 10,
  },
  paymentOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentText: {
    color: "white",
    fontSize: 16,
  },
  optionButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
    backgroundColor: "#1C1C1E",
  },
  navItem: {
    alignItems: "center",
  },
  navTextActive: {
    color: "#FF8C00",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default AddExpenseScreen;
