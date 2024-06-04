import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Chat from "../components/ChatComponents/Chat/Chat";
import DirectoryComponents from "../components/DirectoryComponents/DirectoryComponents";
import Info from "../components/InfoComponents/Info";

const Tab = createBottomTabNavigator();

const MainComponent = () => {
  return (
    <Tab.Navigator
      initialRouteName="ChatList"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "ChatList") {
            iconName = focused
              ? "chatbubble-ellipses"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Contact") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "News") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else if (route.name === "Info") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="ChatList" component={Chat} />
      <Tab.Screen name="Contact" component={DirectoryComponents} />
      <Tab.Screen name="Info" component={Info} />
    </Tab.Navigator>
  );
};

export default MainComponent;
