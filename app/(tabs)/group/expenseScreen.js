import React, { useEffect, useState }  from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native";
import ContactPicker from "../../permission/ContactPicker";

const expensesLocal = [
  { 
    date: "March 2025", 
    data: [
      { id: "1", title: "Diaper + sugar strip", paid: 1300, lent: 650, type: "receipt", date: "Mar 06" },
      {"borrowed": 15, "date": "Mar 17", "id": "nmtloIVMnAoiFOLoHKp8", "lent": undefined, "paid": undefined, "paidBy": "Friend", "title": "Test 2", "type": "receipt"}, 
      {"borrowed": 10, "date": "Mar 17", "id": "0j2G7XLqn9T0QqMeuEMd", "lent": undefined, "paid": undefined, "paidBy": "Friend", "title": "Test ", "type": "receipt"}
    ] 
  },
  {
    date: "February 2025",
    data: [
      { id: "2", title: "Hair cut", paid: 900, lent: 450, type: "receipt", date: "Feb 24" },
      { id: "3", title: "Sagar ratna", paidBy: "Ishita K.", paid: 620, borrowed: 310, type: "receipt", date: "Feb 23" },
      { id: "4", title: "Aptamil", paidBy: "Ishita K.", paid: 950, borrowed: 475, type: "receipt", date: "Feb 23" },
      { id: "5", title: "Sahil return gift", paid: 210, lent: 105, type: "gift", date: "Feb 22" },
      { id: "6", title: "Smart bazaar ferozpur", paid: 1008, lent: 504, type: "cart", date: "Feb 22" },
      { id: "7", title: "Diaper", paidBy: "Ishita K.", paid: 700, borrowed: 350, type: "receipt", date: "Feb 21" },
      { id: "8", title: "Plant pot", paid: 600, lent: 300, type: "receipt", date: "Feb 20" },
    ],
  },


];

const fetchedExpense =   [
  {"amount": 30, "createdAt": {"_nanoseconds": 469000000, "_seconds": 1742209235}, "description": "Test 2", "id": "nmtloIVMnAoiFOLoHKp8", "paidBy": "i6OJJkdfZBOTKpRkIvLw33AL76a2", "participants": ["i6OJJkdfZBOTKpRkIvLw33AL76a2", "VUFUsDmtWOYqnf85LxtpTxRl5Iu1"], "splitType": "equally"}, 
  {"amount": 20, "createdAt": {"_nanoseconds": 201000000, "_seconds": 1742209156}, "description": "Test ", "id": "0j2G7XLqn9T0QqMeuEMd", "paidBy": "i6OJJkdfZBOTKpRkIvLw33AL76a2", "participants": ["i6OJJkdfZBOTKpRkIvLw33AL76a2", "VUFUsDmtWOYqnf85LxtpTxRl5Iu1"], "splitType": "equally"}
]

const formatExpenseData = (expenses, currentUserId) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Group expenses by month
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const dateObj = new Date(expense.createdAt._seconds * 1000);
    const monthYear = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    const date = `${months[dateObj.getMonth()].slice(0, 3)} ${dateObj.getDate()}`;

    const isPaidByUser = expense.paidBy === currentUserId;
    const splitAmount = expense.amount / expense.participants.length;

    const formattedExpense = {
      id: expense.id,
      title: expense.description,
      paidBy: isPaidByUser ? undefined : "Friend", // Replace with actual name if available
      paid: expense.amount, //isPaidByUser ? expense.amount : undefined,
      lent: isPaidByUser ? splitAmount : undefined,  
      borrowed: !isPaidByUser ? splitAmount : undefined,
      type: "receipt",
      date,
    };

    // Add expense to its respective month group
    if (!acc[monthYear]) {
      acc[monthYear] = { id: `${monthYear}-${Math.random()}`, date: monthYear, data: [] };
    }
    acc[monthYear].data.push(formattedExpense);

    return acc;
  }, {});

  return Object.values(groupedExpenses);
};

const ExpenseScreen = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { groupId, groupName, currentUser } = useLocalSearchParams();
  //alert(groupId, currentUser);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`http://192.168.1.3:5000/getExpenses/${groupId}`);
        const result = await response.json();

        if (response.ok) {
          let sortedData = formatExpenseData(result, currentUser)
          setExpenses(sortedData);
        } else {
          console.error("Error fetching expenses:", result.error);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        {expenses.length !== 0 && <Text style={styles.headerTitle}>{groupName}</Text> }
        <TouchableOpacity onPress={() => router.push(`/group/expensePageSetting?groupId=${groupId}&groupName=${groupName}`)} style={styles.backButton}>
          <Ionicons name="settings-outline" size={26} color="white" />
        </TouchableOpacity>
      </View>
      
      {expenses.length === 0 ?  <>
        <View style={styles.groupHeader}>
          <Text style={styles.groupname}>{groupName}</Text>
          <View style={styles.groupHeader}>
            <Text style={styles.noExpensesText}>No expenses here yet.</Text>
          </View>
    
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
        </View>
        
        

        <View>
          <Text style={styles.onlyOneText}>You're the only one here!</Text>
          <SafeAreaView>
            <ContactPicker groupId={groupId} groupName={groupName} currentUser={currentUser} />
          </SafeAreaView>
          <TouchableOpacity style={styles.inviteOption}>
            <Ionicons name="link-outline" size={22} color="#80CBC4" />
            <Text style={styles.inviteText}>Share group link</Text>
          </TouchableOpacity>
        </View>
      </>  :  <>
      {/* Expense List */}
        <ScrollView>
          {expenses.map((section) => (
            <View key={section.date}>
              <Text style={styles.sectionTitle}>{section.date}</Text>
              {section.data.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => router.push(`/group/expenseSummary?expenseId=${item.id}&expenseTitle=${item.title}&amount=${item.paid}&date=${item.date}&paidBy=${item.paidBy}&lent=${item.lent}&borrowed=${item.borrowed}&groupName=${groupName}`)}>  
                  <View key={item.id} style={styles.expenseItem}>
                    {/* Date & Icon */}
                    <View style={styles.leftSection}>
                      <Text style={styles.date}>{item.date}</Text>
                      <View style={styles.iconWrapper}>
                        {item.type === "receipt" && <FontAwesome5 name="receipt" size={24} color="#ccc" />}
                        {item.type === "gift" && <MaterialCommunityIcons name="gift" size={24} color="#FFB6C1" />}
                        {item.type === "cart" && <FontAwesome5 name="shopping-cart" size={24} color="#A9E2A0" />}
                      </View>
                    </View>

                    {/* Title & Payment Details */}
                    <View style={styles.middleSection}>
                      <Text style={styles.expenseTitle}>{item.title}</Text>
                      <Text style={styles.expenseSubtitle}>
                        {item.paidBy ? `${item.paidBy} paid` : "You paid"} {/*${item.paid.toFixed(2)}*/}
                      </Text>
                    </View>

                    {/* Amount Display */}
                    <View style={styles.rightSection}>
                      {item.lent && <Text style={[styles.amount, styles.lent]}>you lent {"\n"} ${item.lent.toFixed(2)}</Text>}
                      {item.borrowed && <Text style={[styles.amount, styles.borrowed]}>you borrowed {"\n"} ${item.borrowed.toFixed(2)}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </>}

      {/* Floating Add Expense Button */}
      <TouchableOpacity style={styles.addExpenseButton} onPress={() => router.push(`/addExpense?groupId=${groupId}&groupName=${groupName}&currentUser=${currentUser}`)}>
        <MaterialIcons name="receipt" size={24} color="white" />
        <Text style={styles.addButtonText}>Add expense</Text>
      </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: "#121212" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 15, alignItems: "center", backgroundColor: "#1C1C1E" },
  headerTitle: { fontSize: 22, color: "white", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, color: "#bbb", paddingHorizontal: 15, marginTop: 20 },
  expenseItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 0.5, borderBottomColor: "#333" },
  leftSection: { width: 50, alignItems: "center" },
  date: { color: "#ccc", fontSize: 14 },
  iconWrapper: { marginTop: 5 },
  middleSection: { flex: 1, paddingHorizontal: 10 },
  expenseTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  expenseSubtitle: { color: "#aaa", fontSize: 14 },
  rightSection: { alignItems: "flex-end" },
  amount: { fontSize: 14, fontWeight: "bold", textAlign: "right" },
  lent: { color: "#76D7C4" },
  borrowed: { color: "#E74C3C" },
  fab: { position: "absolute", bottom: 80, right: 20, backgroundColor: "green", padding: 15, borderRadius: 50 },
  bottomNav: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1C1C1E",
    height: 66,
  },
  navItem: {
    alignItems: "center",
    height: 50,
    marginTop: 10,
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  navTextActive: {
    color: "#1DB954",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
  addExpenseButton: {
    position: "absolute",
    bottom: 130,
    right: 20,
    backgroundColor: "#1DB954",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
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
});

export default ExpenseScreen;
