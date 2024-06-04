import React, { useEffect } from "react";
import { View, TextInput, Pressable, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Ionicons } from "@expo/vector-icons";

import FriendDirectory from "./FriendDirectory";
import GroupDirectory from "./GroupDirectory";

const Tab = createMaterialTopTabNavigator();

const DirectoryComponents = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Pressable
            style={styles.headerIcon}
            onPress={() => { navigation.navigate("AddFriends"); }}>
            <Ionicons
              name="person-add-outline"
              size={22}
              color="white"
            // style={{ marginRight: 10 }}
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={{ marginLeft: 5, marginRight: 25 }}
          />
          <TextInput
            onFocus={() => {
              navigation.navigate("SearchFriends");
            }}
            style={{
              height: 45,
              width: 300,
              marginLeft: 25,
              fontSize: 16,
            }}
            placeholder="Tìm kiếm"
            placeholderTextColor={"white"}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation]);

  return (
    <Tab.Navigator initialRouteName="FriendDirectory" tabBarPosition="top">
      <Tab.Screen name="FriendDirectory" component={FriendDirectory} />
      <Tab.Screen name="GroupDirectory" component={GroupDirectory} />
    </Tab.Navigator>
  );
};

export default DirectoryComponents;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
  },
  headerIcon: {
    marginRight: 20,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    marginLeft: 10,
  },
  headerTitleText: {
    color: "gray",
    fontSize: 18,
    marginLeft: 40,
  },
});
