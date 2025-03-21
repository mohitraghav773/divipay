import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function GroupScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses(); 
    //getExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://192.168.31.49:5000/getExpenses?groupId=${groupId}`);
      console.log("Fetched expenses:", response.data); 
  
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format: Expected an array.");
      }
  
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      Alert.alert("Error", error.message);
    }
  };

   const getExpenses = async (groupId) => {
     try {
       const expensesRef = collection(db, "groups", groupId, "expenses");
       const snapshot = await getDocs(expensesRef);
      
       let expenses = [];
       snapshot.forEach((doc) => {
         expenses.push({ id: doc.id, ...doc.data() });
       });
  
       console.log("Expenses:", expenses); 
       setExpenses(expenses);  
       setButtonTitle  
       return expenses;
     } catch (error) {
       Alert.alert(error.message);
       console.error("Error fetching expenses:", error);
     }
   };

  return (
    <View style={{ padding: 20 }}> 
        <Text>{groupId}</Text>
      <Button title="Add Expense" onPress={() => router.push(`/addExpense?groupId=${groupId}`)} />
      <Text>Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}  
        renderItem={({ item }) => (
          <Button title={`${item.description} : ₹${item.amount} (Paid by ${item.paidBy})`} onPress={() => router.push(`/userBalance?userId=${item.paidBy}`)}>
            <Text>{item.description}: ₹{item.amount} (Paid by {item.paidBy})</Text>
          </Button>
        )}
      />
    </View>
  );
}
