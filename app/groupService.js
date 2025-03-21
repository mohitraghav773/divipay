import { db, auth } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

// Create Group
export const createGroup = async (groupName, members) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Add group to Firestore
    const groupRef = await addDoc(collection(db, "groups"), {
      name: groupName,
      members: [...members, user.uid],
      createdBy: user.uid,
      createdAt: new Date()
    });

    return groupRef.id;
  } catch (error) {
    throw error;
  }
};
