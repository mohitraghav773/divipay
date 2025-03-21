// ContactPicker.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, TextInput, Alert } from "react-native";
import { getContacts } from "../service/contactService";
import { addMemberToGroup } from "../service/firestoreService";
import * as Contacts from 'expo-contacts';

import { Ionicons } from "@expo/vector-icons";

//const functions = require("firebase-functions");
//const admin = require("firebase-admin");

const ContactPicker = ({ groupId, currentUser }) => {
  const [searchText, setSearchText] = useState("");
  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter contacts based on search input
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const fetchContacts = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access contacts was denied.");
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      // Filter contacts that have at least one phone number
      const validContacts = data.filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0);
      setContacts(validContacts);

      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const selectContact = (contact) => {
    console.log("Selected Contact:", contact); // Debugging

    if (!contact || !contact.name || !contact.phoneNumbers?.length) {
      alert("Invalid contact selected.");
      return;
    }

    const selectedUser = {
      userId: contact.id,
      name: contact.name,
      phoneNumber: contact.phoneNumbers[0]?.number || "No number",
    };

    addMemberToGroup(groupId, selectedUser, currentUser);
    //Alert.alert(groupId)
    console.log("Selected Contact Processed:", selectedUser);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <View>
      {/*<TouchableOpacity style={styles.button} onPress={fetchContacts}>
        <Text style={styles.buttonText}>Add Group Members</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.inviteOption} onPress={fetchContacts}>
        <Ionicons name="person-add-outline" size={22} color="#80CBC4" />
        <Text style={styles.inviteText}>Add group members</Text>
      </TouchableOpacity>


      <Modal visible={modalVisible} animationType="slide">
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

          {/* Friends List */}
          {/*<FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactItem} onPress={() => selectContact(item)}>
              <Text style={styles.contactText}>{item.name || "Unknown Contact"}</Text>
            </TouchableOpacity>
          )} /> */}
          <View>
            <Text style={styles.sectionTitle}>Friends on DiviPay</Text>
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity style={styles.contactItem} onPress={() => selectContact(item)}>
                    <View style={styles.avatar} />
                    <Text style={styles.contactText}>{item.name || "Unknown Contact"}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactText: {
    fontSize: 18,
  },
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

export default ContactPicker;
