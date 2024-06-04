import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";

import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";


const OA = ({ navigation }) => {
  const listFriend = [
    "Báo mới",
    "Bộ y tế",
    "Điện máy xanh",
    "Game Center",
    "Thế giới di động",
    "Thời tiết",
  ];
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Pressable style={styles.item}>
          <LinearGradient
            colors={["#b04bff", "#5a38fe"]}
            style={styles.icon}
          >
            <Octicons name="broadcast" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.itemText}>Tìm thêm Official Account</Text>
        </Pressable>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionText}>Official Account đã quan tâm</Text>
        <View style={styles.officialAccountsContainer}>
          {listFriend.map((officialAccount, index) => (
            <Pressable key={index} style={styles.officialAccountItem}>
              <Image
                style={styles.avatar}
                source={require("../../../assets/meomeo.jpg")}
              />
              <Text style={styles.officialAccountText}>{officialAccount}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  officialAccountsContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  officialAccountItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  officialAccountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 50,
  },
});

export default OA;
