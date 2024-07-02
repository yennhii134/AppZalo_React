import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFriend from "../../hooks/useFriend";
import { useSelector } from "react-redux";
import { selectFriends } from "../../redux/stateFriendsSlice";
import { SwipeListView } from 'react-native-swipe-list-view';
import { useAuthContext } from "../../contexts/AuthContext";
import useConversation from "../../hooks/useConversation";

const FriendDirectory = ({ navigation }) => {
  const { unFriend } = useFriend();
  const friends = useSelector(selectFriends);
  const [isLoading, setIsLoading] = useState([]);
  const { authUser } = useAuthContext();
  const [listFriends, setListFriends] = useState([])
  const { handleMessageNavigation } = useConversation();

  useEffect(() => {
    setListFriends(friends.map((item, i) => ({ ...item, key: item.userId })))
  }, [friends])

  const handleUnFriend = async (item) => {
    setIsLoading((prev) => [...prev, { userId: item.userId }])
    await unFriend(item.userId);
    setIsLoading((prev) => prev.filter((itemLoading) => itemLoading.userId !== item.userId))
  };

  const handlePageNavigation = async (friend) => {
    const chatItem = await handleMessageNavigation(friend)

    navigation.navigate("Message", { chatItem: chatItem });
  };

  const renderFriend = ({ item }) => (
    < View style={styles.friendRow} >
      <Pressable
        style={styles.friendItem}
        onPress={() => handlePageNavigation(item)}
      >
        <View style={styles.friendInfo}>
          <Image source={{ uri: item.profile.avatar.url }}
            style={styles.friendAvatar}
          />
          <Text style={styles.friendName}>{item.profile.name}</Text>
        </View>
        <View style={styles.friendActions}>
          <View style={styles.actionIcon}>
            <Ionicons name={"call-outline"} size={25} color={"black"} />
          </View>
          <View style={styles.actionIcon}>
            <Ionicons
              name={"videocam-outline"}
              size={25}
              color={"black"}
            />
          </View>
        </View>
      </Pressable>
    </View >
  )


  const renderChoose = ({ index, item }) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
          <Text style={styles.backTextWhite}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => handleUnFriend(item)}>
          {isLoading.some((itemLoading) => itemLoading.userId === item.userId)
            ? <ActivityIndicator size='20' color='white' />
            : <Text style={styles.backTextWhite}>Huỷ kết bạn</Text>
          }
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Pressable
          style={styles.buttonRow}
          onPress={() => navigation.navigate("FriendRequest")}
        >
          <Ionicons name={"people-circle-sharp"} size={40} color={"#0091FF"} />
          <Text style={styles.buttonText}>Lời mời kết bạn</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 25, height: 25, backgroundColor: 'red', borderRadius: 50, marginLeft: 10 }}>
            <Text style={{ color: 'white', fontWeight: "bold" }}>{authUser.requestReceived.length}</Text>
          </View>
        </Pressable>
      </View >
      <View style={styles.buttonBar}>
        <Pressable style={styles.roundedButton}>
          <Text style={styles.whiteText}>Tất cả {friends.length}</Text>
        </Pressable>
      </View>

      {/* List danh bạ nè */}
      <View style={styles.friendList}>
        <SwipeListView
          data={listFriends}
          renderItem={renderFriend}
          renderHiddenItem={renderChoose}
          rightOpenValue={-75}
          stopRightSwipe={-75} // Dừng swipe khi mở hết phần bên phải
        />
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  topSection: {
    backgroundColor: "white",
    padding: 10,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  buttonBar: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
  },
  roundedButton: {
    borderRadius: 50,
    backgroundColor: "#bebebe",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 10,
  },
  borderedButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  whiteText: {
    color: "white",
    fontSize: 16,
  },
  grayText: {
    color: "gray",
    fontSize: 16,
  },
  friendList: {
    backgroundColor: "white",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  addText: {
    color: "#0091FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  friendRow: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    marginBottom: 5
  },
  friendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
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
  friendActions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginRight: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    justifyContent: "center",
    alignItems: "center",
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    height: 70
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  },
});

export default FriendDirectory;
