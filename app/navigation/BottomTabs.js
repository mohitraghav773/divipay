import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AccountScreen from "../(tabs)/accountScreen";
import HomeScreen from "../(tabs)/homeScreen"; 

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Groups") iconName = "account-group";
          else if (route.name === "Friends") iconName = "account-multiple";
          else if (route.name === "Activity") iconName = "image-multiple";
          else if (route.name === "Account") iconName = "account-circle";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#a29bfe",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Groups" component={HomeScreen} />
      <Tab.Screen name="Friends" component={AccountScreen} />
      <Tab.Screen name="Activity" component={AccountScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};
