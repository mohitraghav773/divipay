// src/auth/googleAuthConfig.js
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { makeRedirectUri } from "expo-auth-session";

//import * as WebBrowser from "expo-web-browser";
//import { googleConfig } from "./googleAuthConfig";

// 👉 Add your Web Client ID here from Firebase
export const googleConfig = {
    expoClientId: "323161333268-jm0ti9l2k8n2bdodm24gvvabrnm0f25f.apps.googleusercontent.com", 
    androidClientId: "323161333268-jm0ti9l2k8n2bdodm24gvvabrnm0f25f.apps.googleusercontent.com", 
    iosClientId: "323161333268-118h86i3embjp9lar7no179c8ti41crh.apps.googleusercontent.com",
};


export const useGoogleAuth = () => {
  const [user, setUser] = useState(null);
  const webClientId = "323161333268-jm0ti9l2k8n2bdodm24gvvabrnm0f25f.apps.googleusercontent.com";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: webClientId,
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      fetchUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfo = await response.json();
      setUser(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return { user, promptAsync };
};

