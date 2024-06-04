import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Image,
  CheckBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CreateGroup = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState("ganDay");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const danhBaData = [
    {
      ten: "Nguyen Van A",
      url: "https://randomuser.me/api/portraits/men/68.jpg",
      tinNhan: "Hello",
      soTNChuaDoc: 6,
      thoiGian: 2,
    },
    {
      ten: "Luong thi Tho",
      url: "https://randomuser.me/api/portraits/men/70.jpg",
      tinNhan: "Khoe khong",
      soTNChuaDoc: 0,
      thoiGian: 6,
    },
    {
      ten: "Nguyen Van Teo",
      url: "https://randomuser.me/api/portraits/men/80.jpg",
      tinNhan: "An com chua",
      soTNChuaDoc: 0,
      thoiGian: 0,
    },
    {
      ten: "Le Van Ty",
      url: "https://randomuser.me/api/portraits/men/90.jpg",
      tinNhan: "Dang lam gi the",
      soTNChuaDoc: 5,
      thoiGian: 8,
    },
    {
      ten: "Huynh Quoc Hao",
      url: "https://randomuser.me/api/portraits/men/10.jpg",
      tinNhan: "may gio roi",
      soTNChuaDoc: 7,
      thoiGian: 0,
    },
    {
      ten: "Bui Tri Thuc",
      url: "https://randomuser.me/api/portraits/men/20.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 3,
      thoiGian: 12,
    },
    {
      ten: "Thanh Tam",
      url: "https://randomuser.me/api/portraits/men/53.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 0,
      thoiGian: 5,
    },
    {
      ten: "Hung Dung",
      url: "https://randomuser.me/api/portraits/men/62.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 4,
      thoiGian: 0,
    },
    {
      ten: "Nam",
      url: "https://randomuser.me/api/portraits/men/26.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 7,
      thoiGian: 2,
    },
    {
      ten: "Hau",
      url: "https://randomuser.me/api/portraits/men/63.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 0,
      thoiGian: 3,
    },
  ]; // (Dữ liệu danh bạ)
  const ganDayData = [
    {
      ten: "Huynh Quoc Hao",
      url: "https://randomuser.me/api/portraits/men/10.jpg",
      tinNhan: "may gio roi",
      soTNChuaDoc: 7,
      thoiGian: 0,
    },
    {
      ten: "Bui Tri Thuc",
      url: "https://randomuser.me/api/portraits/men/20.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 3,
      thoiGian: 12,
    },
    {
      ten: "Thanh Tam",
      url: "https://randomuser.me/api/portraits/men/53.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 0,
      thoiGian: 5,
    },
    {
      ten: "Hung Dung",
      url: "https://randomuser.me/api/portraits/men/62.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 4,
      thoiGian: 0,
    },
    {
      ten: "Nam",
      url: "https://randomuser.me/api/portraits/men/26.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 7,
      thoiGian: 2,
    },
    {
      ten: "Hau",
      url: "https://randomuser.me/api/portraits/men/63.jpg",
      tinNhan: "lam bai tap chua",
      soTNChuaDoc: 0,
      thoiGian: 3,
    },
  ]; // (Dữ liệu gần đây)

  const renderItem = ({ item }) => (
    <Pressable onPress={() => handleCheckboxToggle(item)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
        }}
      >
        <Image
          source={{ uri: item.url }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
        />
        <Text>{item.ten}</Text>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <CheckBox
            value={selectedMembers.includes(item)}
            onValueChange={() => handleCheckboxToggle(item)}
          />
        </View>
      </View>
    </Pressable>
  );

  const handleCheckboxToggle = (item) => {
    console.log("Checkbox Toggled for:", item.ten);
    const isSelected = selectedMembers.includes(item);
    const updatedSelectedMembers = isSelected
      ? selectedMembers.filter((member) => member !== item)
      : [...selectedMembers, item];

    setSelectedMembers(updatedSelectedMembers);
  };

  const renderTabContent = () => {
    const data = selectedTab === "ganDay" ? ganDayData : danhBaData;
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.ten}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Ionicons
          name="search"
          size={24}
          color="black"
          style={{ position: "absolute", paddingStart: 10, opacity: 0.5 }}
        />
        <TextInput
          style={{
            height: 45,
            width: "100%",
            paddingLeft: 40,
            borderRadius: 10,
            color: "black",
            backgroundColor: "#F2F2F2",
          }}
          placeholder="Tìm tên hoặc số điện thoại"
          placeholderTextColor={"#8B8B8B"}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <Pressable onPress={() => setSelectedTab("ganDay")}>
          <Text style={{ color: selectedTab === "ganDay" ? "blue" : "black" }}>
            Gần đây
          </Text>
        </Pressable>
        <Pressable onPress={() => setSelectedTab("danhBa")}>
          <Text style={{ color: selectedTab === "danhBa" ? "blue" : "black" }}>
            Danh bạ
          </Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }}>{renderTabContent()}</ScrollView>

      {selectedMembers.length > 0 && (
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedMembers.map((member) => (
              <View key={member.ten} style={{ margin: 5 }}>
                <Image
                  source={{ uri: member.url }}
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                />
                <Pressable onPress={() => handleCheckboxToggle(member)}>
                  <Text>❌</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
          <Pressable onPress={() => handleCreateGroup()}>
            <View
              style={{
                backgroundColor: "#0091FF",
                alignItems: "center",
                justifyContent: "center",
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            >
              <Ionicons
                name="arrow-forward"
                size={20}
                color="grap"
                style={{ marginHorizontal: 10 }}
              />
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CreateGroup;
