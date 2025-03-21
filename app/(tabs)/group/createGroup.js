import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

const groupTypes = [
  { id: "1", name: "Trip", icon: "airplane-outline" },
  { id: "2", name: "Home", icon: "home-outline" },
  { id: "3", name: "Couple", icon: "heart-outline" },
  { id: "4", name: "Other", icon: "document-text-outline" },
];

const CreateGroupScreen = () => {
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState(null);
  const [groupType, setGroupType] = useState(null);
  const [user, setUser] = useState("");
  const router = useRouter();

  //Fetch logged-in user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        Alert.alert("Login Required", "You need to be logged in to create a group.");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const createGroup = async (groupName, groupType, user) => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to create a group.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "groups"), {
        groupName,
        groupType,
        groupImage: imageUri || null,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        members: [{ userId: user.uid, name: user.displayName, email: user.email, email: user.phone }] // Add the creator as the first member
      });
      
      //alert(groupName)
      console.log("Group created with ID: ", docRef.id);
      router.push(`/group/expenseScreen?groupId=${docRef.id}&groupName=${groupName}&userId=${user.uid}`);
    } catch (error) {
      console.error("Error creating group: ", error);
      alert(error.message)
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a group</Text>
        <TouchableOpacity onPress={() => { createGroup(groupName, groupType, user)}
        } disabled={!groupName}>
          <Text style={[styles.doneText, !groupName && { opacity: 0.5 }]}>Done</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity onPress={() => router.push(`/group/groupDetail`)}>
          <Text >Done</Text>
        </TouchableOpacity>*/}
      </View>

      <View>
      {/* Group Image and Name */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {groupImage ? (
          <Image source={{ uri: groupImage }} style={styles.groupImage} />
        ) : (
          <Ionicons name="camera-outline" size={30} color="white" />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Group name"
        placeholderTextColor="#B0BEC5"
        value={groupName}
        onChangeText={setGroupName}
      />

      {/* Group Type Selection */}
      <Text style={styles.typeText}>Type</Text>
      <FlatList
        data={groupTypes}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.typeContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.typeButton, groupType === item.id && styles.typeButtonSelected]}
            onPress={() => setGroupType(item.id)}
          >
            <Ionicons name={item.icon} size={20} color={groupType === item.id ? "black" : "white"} />
            <Text style={[styles.typeButtonText, groupType === item.id && { color: "black" }]}>{item.name}</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  doneText: {
    color: "#80CBC4",
    fontSize: 18,
    fontWeight: "bold",
  },
  imagePicker: {
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  groupImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  input: {
    backgroundColor: "#1C1C1E",
    color: "white",
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  typeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    height:60,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  typeButtonSelected: {
    backgroundColor: "#80CBC4",
  },
  typeButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CreateGroupScreen;
