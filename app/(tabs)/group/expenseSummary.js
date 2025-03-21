import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Button } from "react-native";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig"; // Ensure this is correctly imported


const ExpenseDetailScreen = () => {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const { expenseId, expenseTitle, amount, date, paidBy, lent, borrowed, groupName } = useLocalSearchParams();
  
  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!expenseId) {
      console.error("Invalid expenseId: Cannot add comment");
      return;
    }



    console.log('step 1', expenseId)
    //const expenseRef = doc(db, "groups/yUcly5yKvuZkBH1HF8Af/expenses", expenseId);
    const expenseRef = doc(db, "groups", "yUcly5yKvuZkBH1HF8Af", "expenses", "FDHfi7uJqR3nwltRo3Hj");
    const expenseSnap = await getDoc(expenseRef);
      console.log('step 3')
      if (!expenseSnap.exists()) {
        console.error("Expense does not exist:", expenseId);
        alert("Error: Expense not found!");
        return;
      }  
    
    console.log('step 2')
    try {
      /*const response = await fetch("http://192.168.1.3:5000/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expenseId,
          userId: auth.currentUser.uid,
          comment
        }),
      });
      //console.log("Comment added successfully!");
      const result = await response.json();
      if (response.ok) {
        alert("Comment added successfully!");
        setComment(""); // Clear input after adding
      } else {
        alert("Error: " + result.error);
        console.log("Error: " + result.error);
      }*/

      const expenseSnap = await getDoc(expenseRef);
      console.log('step 3')
      if (!expenseSnap.exists()) {
        console.error("Expense does not exist:", expenseId);
        alert("Error: Expense not found!");
        return;
      }
      console.log('step 4')
      await updateDoc(expenseRef, {
        comments: [...expenseSnap.data().comments, { userId: auth.currentUser.uid, comment }]
      });
      
      console.log('step 5')
      alert("Comment added successfully!");
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    console.log(expenseId, expenseTitle, amount, date, paidBy, lent, borrowed, groupName);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{expenseTitle}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="camera-outline" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="trash-outline" size={24} color="black" style={styles.iconSpacing} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="pencil-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Expense Info */}
        <View style={styles.expenseBox}>
          <Text style={styles.expenseTitle}>{expenseTitle}</Text>
          <Text style={styles.expenseAmount}>${amount}</Text>
          <Text style={styles.expenseDate}>Added by you on 10-Mar-2025</Text>
          <View style={styles.pieChartPlaceholder} /> 
          <Text style={styles.paymentText}>You paid ${amount}</Text>
          {lent != undefined && <Text style={styles.oweText}>You owe ${lent}</Text>}
          {borrowed != undefined && <Text style={styles.oweText}>You borrowed ${borrowed}</Text>}
          <Text style={styles.oweText}>Ishita K. owes $2,203.50</Text>
        </View>

        {/* Spending Trends Chart */}
        <Text style={styles.chartTitle}>Spending trends for {groupName} :: Gas/fuel</Text>
        <View style={styles.chartBar}>
          <Text style={styles.monthLabel}>Jan</Text>
          <View style={[styles.bar, { width: "90%" }]} />
          <Text style={styles.amountLabel}>$5,400.00</Text>
        </View>
        <View style={styles.chartBar}>
          <Text style={styles.monthLabel}>Feb</Text>
          <View style={[styles.bar, { width: "40%" }]} />
          <Text style={styles.amountLabel}>$2,000.00</Text>
        </View>
        <View style={styles.chartBar}>
          <Text style={styles.monthLabel}>Mar</Text>
          <View style={[styles.bar, { width: "75%" }]} />
          <Text style={styles.amountLabel}>$4,407.00</Text>
        </View>

        {/* View More Charts Button */}
        {/* <TouchableOpacity style={styles.viewMoreButton}>
          <Ionicons name="diamond-outline" size={20} color="white" />
          <Text style={styles.viewMoreText}>View more charts</Text>
        </TouchableOpacity> */}
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentBox}>
        <TextInput placeholder="Add a comment" value={comment}
        onChangeText={setComment} placeholderTextColor="#aaa" style={styles.input} />
        <TouchableOpacity onPress={handleAddComment}>
          <Ionicons name="send" size={24} color="#aaa" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#F4C2C2", padding: 15 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: "bold", textAlign: "center", color: "black" },
  headerIcons: { flexDirection: "row", alignItems: "center" },
  iconSpacing: { marginHorizontal: 10 },

  expenseBox: { backgroundColor: "#1E1E1E", padding: 20, borderRadius: 10, margin: 15 },
  expenseTitle: { fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center" },
  expenseAmount: { fontSize: 28, fontWeight: "bold", color: "white", textAlign: "center", marginVertical: 5 },
  expenseDate: { fontSize: 14, color: "#bbb", textAlign: "center" },
  pieChartPlaceholder: { height: 80, width: 80, borderRadius: 40, backgroundColor: "#E57373", alignSelf: "center", marginVertical: 10 },
  paymentText: { fontSize: 16, fontWeight: "bold", color: "white", textAlign: "center", marginVertical: 5 },
  oweText: { fontSize: 14, color: "#E57373", textAlign: "center" },

  chartTitle: { fontSize: 16, color: "#bbb", marginLeft: 15, marginTop: 20, marginBottom: 10 },
  chartBar: { flexDirection: "row", alignItems: "center", marginHorizontal: 15, marginBottom: 8 },
  monthLabel: { fontSize: 14, color: "white", width: 40 },
  bar: { height: 12, backgroundColor: "#F4C2C2", borderRadius: 6 },
  amountLabel: { fontSize: 14, color: "white", marginLeft: 10 },

  viewMoreButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#7D3C98", padding: 12, borderRadius: 8, marginHorizontal: 15, justifyContent: "center", marginTop: 10 },
  viewMoreText: { fontSize: 16, color: "white", marginLeft: 8 },

  commentBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#1E1E1E", padding: 10, borderTopWidth: 1, borderColor: "#333", marginBottom: 50 },
  input: { flex: 1, color: "white", paddingLeft: 10, fontSize: 16 },
});

export default ExpenseDetailScreen;
