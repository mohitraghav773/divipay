import { db, auth } from "./firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Add Friend
export const addFriend = async (friendEmail) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // Get friend UID from Firestore
    const friendQuery = doc(db, "users", friendEmail);
    const friendDoc = await getDoc(friendQuery);
    
    if (!friendDoc.exists()) throw new Error("Friend not found");

    const friendId = friendDoc.id;

    // Update user's friend list
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      friends: arrayUnion(friendId)
    });

    return "Friend added!";
  } catch (error) {
    throw error;
  }
};
