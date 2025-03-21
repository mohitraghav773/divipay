// firestoreService.js
import { db } from "../firebaseConfig";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export const addMemberToGroup = async (groupId, member, currentUser) => {
  try {
    const groupRef = doc(db, "groups", groupId); // Reference to the group document
    const userRef = doc(db, "users", member.userId); // Reference to user's document
    
    // Add user to group members
    await updateDoc(groupRef, {
      members: arrayUnion(member), // Add new member to the members array
    });

    // 2️⃣ Check if user document exists in "users" collection
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // If user exists, update their groups array
      await updateDoc(userRef, {
        groups: arrayUnion(groupId),
      });
    } else {
      // If user doesn't exist, create a new user document with the group ID
      await setDoc(userRef, {
        groups: [groupId],
        name: member.name || "Unknown", // Optionally store user's name
      });
    }

    console.log(`Member ${member.userId} added to group ${groupId}`);
  } catch (error) {
    console.error("Error adding member to group and updating user:", error);
  }
};
