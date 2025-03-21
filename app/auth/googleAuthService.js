// src/auth/googleAuthService.js
/*import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn();

    // Create a Firebase credential
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign in with Firebase
    const userCredential = await auth().signInWithCredential(googleCredential);

    return userCredential.user; // Return user details
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

export const signOutGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    await auth().signOut();
    console.log('User signed out from Google');
  } catch (error) {
    console.error('Sign-out Error:', error);
  }
};*/
