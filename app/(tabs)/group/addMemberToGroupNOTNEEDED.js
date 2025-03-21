import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Dummy data for contacts (replace with real data)
const contacts = [
  { id: "1", name: "akashparnami" },
  { id: "2", name: "Gudia Airtel" },
  { id: "3", name: "Hitesh" },
  { id: "4", name: "Ishita Kaushik" },
  { id: "5", name: "Kanvi Kaushik" },
  { id: "6", name: "Kirandeep Gaur" },
  { id: "7", name: "Ritik Gaur" },
  { id: "8", name: "Vasu Kaushik" },
  { id: "9", name: "Vimal Verma" },
  { id: "10", name: "akashparnami" },
  { id: "11", name: "Gudia Airtel" },
  { id: "12", name: "Hitesh" },
  { id: "13", name: "Ishita Kaushik" },
  { id: "14", name: "Kanvi Kaushik" },
  { id: "15", name: "Kirandeep Gaur" },
  { id: "16", name: "Ritik Gaur" },
  { id: "17", name: "Vasu Kaushik" },
  { id: "18", name: "Vimal Verma" },
];

const ContactsScreen = () => {
  const [searchText, setSearchText] = useState("");

  // Filter contacts based on search input
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Enter name, email, or phone #"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Add a New Contact */}
      <View>
        <TouchableOpacity style={styles.addContactButton}>
          <Ionicons name="person-add-outline" size={24} color="#6bc46d" />
          <Text style={styles.addContactText}>Add a new contact to DiviPay</Text>
        </TouchableOpacity>
      </View>

      <View>
        {/* Friends List */}
        <Text style={styles.sectionTitle}>Friends on DiviPay</Text>
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.contactItem}>
              <View style={styles.avatar} />
              <Text style={styles.contactText}>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  addContactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addContactText: {
    color: "#6bc46d",
    fontSize: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#444",
    marginRight: 12,
  },
  contactText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ContactsScreen;
