import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useConversation from "../../../hooks/useConversation";
import { useSelector } from "react-redux";
import { selectFriends } from "../../../redux/stateFriendsSlice";
import useGroup from "../../../hooks/useGroup";

function SearchFriends({ navigation }) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedFriendIndex] = useState(null);
  const [listFilter, setListFilter] = useState([])
  const { handleMessageNavigation } = useConversation();
  const searchInputRef = useRef(null);
  const friends = useSelector(selectFriends);
  const { groups, getGroups } = useGroup();
  const states = { LIST: 'LIST', FILTER: 'FILTER', NULL: 'NULL' }
  const [isSearch, setIsSearch] = useState(states.LIST)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingVertical: 3,
            width: 220,
            height: 40
          }}
        >
          <Ionicons name="search" size={18} color="gray" />
          <View style={{ width: 175, height: 30, justifyContent: 'center' }}>
            <TextInput
              style={{ marginLeft: 5 }}
              placeholder="Tìm kiếm"
              placeholderTextColor={"gray"}
              onChangeText={(text) => setSearchKeyword(text)}
              ref={searchInputRef}
            /></View>
          <Pressable onPress={() => {
            setSearchKeyword("")
            if (searchInputRef.current) {
              searchInputRef.current.clear();
            }
          }} style={{ width: 30, height: 40, justifyContent: 'center' }}>
            <Ionicons name="close" size={20} color="gray" />
          </Pressable>
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

  useEffect(() => {
    getGroups()
  }, [])

  useEffect(() => {
    if (searchKeyword === '') {
      setIsSearch(states.LIST)
    }
    else {
      const filterFriends = friends.filter((friend) =>
        friend.profile.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      const filterGroup = groups.filter((group) =>
        group.groupName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      if (filterFriends.length > 0 || filterGroup.length > 0) {
        setListFilter({ ...listFilter, filterFriends, filterGroup })
        setIsSearch(states.FILTER)
      } else {
        setIsSearch(states.NULL)
      }
    }
  }, [searchKeyword])

  const handleFriendPress = async (item) => {
    const response = await handleMessageNavigation(item)
    navigation.navigate("Message", { chatItem: response });
  };
  const renderItem = (item, index) => {
    return (
      <View key={index} style={styles.friendRow}>
        <Pressable
          key={index}
          onPress={() => handleFriendPress(item)}
          style={[styles.friendItem, index === selectedFriendIndex && { backgroundColor: "#e0e0e0" }]}>
          <View style={styles.friendInfo}>
            <Image
              source={{
                uri:
                  item?.profile?.avatar?.url ||
                  item.avatar.url
              }}
              style={styles.friendAvatar}
            />
            <Text style={styles.friendName}>{item?.profile?.name || item.groupName}</Text>
          </View>
        </Pressable>
      </View>)
  }
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.friendList}>
          {isSearch === states.NULL ? (<View></View>) : isSearch === states.FILTER ? (
            < View>
              {[...listFilter?.filterFriends, ...listFilter?.filterGroup].map((item, index) => renderItem(item, index))}
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>Bạn bè</Text>
              {friends.slice(0, 5).map((friend, index) => renderItem(friend, index))}
              <Text style={{ fontSize: 16, fontWeight: 'bold', paddingLeft: 10 }}>Nhóm</Text>
              {groups.slice(0, 5).map((group, index) => renderItem(group, index))}
            </View>
          )}
        </View>
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  friendList: {
    backgroundColor: "white",
    padding: 10,
    borderTopColor: "#e5e5e5",
    borderTopWidth: 0.5,
  },
  friendRow: {
    paddingVertical: 10,
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
  },
});

export default SearchFriends;
