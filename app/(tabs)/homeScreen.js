import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { collection, query, where, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Make sure this is correctly configured

const expenseGroups = [
  {
    id: "1",
    title: "Household",
    subtitle: "you are owed $1,09,652.50",
    details: "Ishita K. owes you $1,09,652.50",
    textColor: "#80CBC4",
  },
  {
    id: "2",
    title: "Mohit Money",
    subtitle: "you owe ₹19,435.00",
    details: "You owe Ishita K. ₹19,435.00",
    textColor: "#FF7043",
  },
  {
    id: "3",
    title: "Non-group expenses",
    subtitle: "settled up",
    details: "Hiding groups that have been settled up over one month.",
    textColor: "#B0BEC5",
  },
];

const settledGroups = [
  { id: "4", title: "Sakshi marriage", subtitle: "settled up", icon: "✈️" },
  { id: "5", title: "Varanasi Trip", subtitle: "settled up", icon: "✈️" },
];

const authDataTest =[
  {
    "apiKey": "AIzaSyCPVPo-jHHGuYY0e4U4lQ-VFvySuMeC2sE", 
    "appName": "[DEFAULT]", 
    "authDomain": 
    "divipay-5b1de.firebaseapp.com", 
    "currentUser": {
      "_redirectEventId": undefined, 
      "apiKey": "AIzaSyCPVPo-jHHGuYY0e4U4lQ-VFvySuMeC2sE", 
      "appName": "[DEFAULT]", "createdAt": "1742389625482", 
      "displayName": undefined, 
      "email": "test.user2@gmail.com", 
      "emailVerified": false, 
      "isAnonymous": false, 
      "lastLoginAt": "1742391348808", 
      "phoneNumber": undefined, 
      "groupImage": undefined, 
      "providerData": [Array], 
      "stsTokenManager": [Object], 
      "tenantId": undefined, 
      "uid": "OqeafxPpkzbpsoI5FtBzckkfnYA3"
    }
  }
]

const HomeScreen = () => {
  const router = useRouter();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);
  const [showSettled, setShowSettled] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState("All groups");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  //const dropdownHeight = new Animated.Value(0);

  const filters = [
    "All groups",
    "Outstanding balances",
    "Groups you owe",
    "Groups that owe you",
  ];

  useEffect(() => {  
    const fetchGroups = async () => {
      try {
        const user = auth.currentUser;
        //alert("User Name:", user.displayName) 
        if (!user) {
          console.log("User not logged in");
          return;
        }

        /*const q = query(
          collection(db, "groups"),
          where("members", "array-contains", user.uid)
        );*/

        const querySnapshot = await getDocs(collection(db, "groups"));
        if (querySnapshot.empty) {
          console.log("No groups found for this user.");
        }
        const groupList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(), 
        }))
        .filter(group => 
          Object.values(group.members).some(member => member.userId === user.uid)
        );

        setGroups(groupList); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Summary */}
        <View style={styles.header}>
          {data && <Text>Data: {JSON.stringify(data)}</Text>}
          <Text style={styles.summaryText}>
            Overall, you owe <Text style={styles.oweText}>₹19,435.00</Text> and you are owed <Text style={styles.owedText}>$1,09,652.50</Text>
          </Text>

          <View style={styles.containerDropdown}>
            {/* Filter Icon Button */}
              <TouchableOpacity style={styles.iconButton} onPress={() => setDropdownVisible(!isDropdownVisible)}>
                <Ionicons name="filter-outline" size={28} color="white" />
              </TouchableOpacity>

              {/* Absolute Positioned Dropdown */}
              {isDropdownVisible && (
                <View style={styles.dropdown}>
                  {filters.map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      style={styles.option}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setDropdownVisible(false);
                      }}
                    >
                      <Ionicons
                        name={selectedFilter === filter ? "radio-button-on" : "radio-button-off"}
                        size={22}
                        color={selectedFilter === filter ? "#FF9800" : "white"}
                      />
                      <Text style={styles.optionText}>{filter}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
          </View>
        </View>

        {/* Expense Groups List */}
        {/*<FlatList
          data={expenseGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/group/expenseScreen?groupId=${item.id}&groupName=${item.title}&currentUser=${auth.currentUser}`)}>  
              <View style={styles.expenseItem}>
                <Text style={styles.expenseIcon}>{item.icon}</Text>
                <View>
                  <Text style={styles.expenseTitle}>{item.title}</Text>
                  <Text style={[styles.expenseSubtitle, { color: item.textColor }]}>{item.subtitle}</Text>
                  <Text style={styles.expenseDetails}>{item.details}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />  */}

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push(`/group/expenseScreen?groupId=${item.id}&groupName=${item.groupName}&currentUser=${auth.currentUser}`)}>  
                <View style={styles.groupItem}>
                  <Text style={styles.groupTitle}>{item.groupName}</Text>
                  <Text style={styles.groupDetails}>Members: {item.members.length}</Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        )}

        <TouchableOpacity style={styles.settledButton} onPress={() => router.push("/group/createGroup")}>
          <Text style={styles.settledButtonText}>Start a new group</Text>
        </TouchableOpacity>

        {/* Settled Groups Toggle Button */}
        <TouchableOpacity style={styles.settledButton} onPress={() => setShowSettled(!showSettled)}>
          <Text style={styles.settledButtonText}>
            {showSettled ? "Re-hide" : `Show ${settledGroups.length} settled-up groups`}
          </Text>
        </TouchableOpacity>

        {/* Settled Groups List */}
        {showSettled && (
          <FlatList
            data={settledGroups}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.settledItem}>
                <Text style={styles.settledIcon}>{item.icon}</Text>
                <View>
                  <Text style={styles.settledTitle}>{item.title}</Text>
                  <Text style={styles.settledSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Floating Add Expense Button */}
      <TouchableOpacity style={styles.addExpenseButton} onPress={() => router.push("/addExpense")}>
        <MaterialIcons name="receipt" size={24} color="white" />
        <Text style={styles.addButtonText}>Add expense</Text>
      </TouchableOpacity>

      {/* Fixed Bottom Navigation Bar */}
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
  containerDropdown: {
    position: "relative",
    alignItems: "flex-end",
    padding: 0,marginBottom:20,
    backgroundColor: "#121212",
    flex: 1,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#1C1C1E",
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  dropdown: {
    position: "absolute",
    top: 50, // Adjust to position below the icon
    right: 0, // Align with the icon button
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    paddingVertical: 10,
    width: 250,
    zIndex: 999, // Ensure it stays on top
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth:1,
    borderTopColor:"#80CBC4",
    borderBottomWidth:1,
    borderBottomColor:"#80CBC4",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  summaryText: {
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    width:"80%",
  },
  oweText: {
    color: "#FF7043",
    fontWeight: "bold",
  },
  owedText: {
    color: "#80CBC4",
    fontWeight: "bold",
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  expenseIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  expenseTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  expenseSubtitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseDetails: {
    color: "#B0BEC5",
    fontSize: 14,
  },
  settledButton: {
    borderWidth: 1,
    borderColor: "#80CBC4",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  settledButtonText: {
    color: "#80CBC4",
    fontSize: 16,
  },
  settledItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settledIcon: {
    fontSize: 30,
    marginRight: 15,
    color: "#FF7043",
  },
  settledTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  settledSubtitle: {
    color: "#B0BEC5",
    fontSize: 14,
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
  bottomNav: {
    position: "absolute",
    bottom: 49,
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
  loadingText: { color: "white", fontSize: 16, textAlign: "center", marginTop: 20 },
  groupItem: {
    backgroundColor: "#1C1C1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  groupDetails: { color: "#B0BEC5", fontSize: 14 },
  createGroupButton: {
    borderWidth: 1,
    borderColor: "#80CBC4",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  createGroupButtonText: { color: "#80CBC4", fontSize: 16 },
});

export default HomeScreen;

