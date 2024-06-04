import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../api/axiosInstance";
import { useAuthContext } from "../../contexts/AuthContext";
import useFriend from "../../hooks/useFriend";
import useConversation from "../../hooks/useConversation";
import { useSelector } from "react-redux";
import { useSocketContext } from "../../contexts/SocketContext";

const FriendDirectory = ({ navigation }) => {
  const { handleFriendMessage } = useConversation();
  const { unFriend, getFriendById, showSuccessToast} = useFriend();
  const [friends, setFriends] = useState([]);
  const { reloadAuthUser } = useAuthContext();
  const [totalFriends, setTotalFriends] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPosition, setModalPosition] = useState({});
  const [selectedFriendPhone, setSelectedFriendPhone] = useState(null);
  var isGroupRedux = useSelector(state => state.isGroup.isGroup);
  const { socket } = useSocketContext()

  const toggleModal = (index, friendPhone) => {
    setSelectedFriendPhone(friendPhone);
    setModalPosition({ top: index * 70 + 300 });
    setModalVisible(!modalVisible);
  };
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axiosInstance.get("/users/get/friends");
        setFriends(response.data.friends);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFriends();
  }, [isGroupRedux]);

  useEffect(() => {
    setTotalFriends(friends.length);
  }, [friends]);

  const handleUnFriend = async () => {
    if (!selectedFriendPhone) return;

    try {
      await unFriend(selectedFriendPhone);
      showSuccessToast("Huỷ kết bạn thành công")
      // Cập nhật danh sách bạn bè sau khi hủy kết bạn thành công
      const updatedFriends = friends.filter(
        (friend) => friend.phone !== selectedFriendPhone);
      setFriends(updatedFriends);
      // Thực hiện reloadAuthUser ở đây nếu cần
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showSuccessToast("Hủy kết bạn thất bại!");
    }
    setModalVisible(false);
  };

  const handlePageNavigation = async (friend) => {
      const response = await handleFriendMessage(friend)
      navigation.navigate("Message", { chatItem: response });
  };

  useEffect(() => {
    if(socket){
      socket.on("accept-request-add-friend", async (sender) => {
         // console.log("accept-request-sender", sender);
        const getUser = await getFriendById(sender.sender.userId)
        const newFriend = {
          email: getUser.email,
          phone: getUser.phone,
          profile: getUser.profile,
          userId: getUser.id
        }
        setFriends([...friends, newFriend])
      })
      socket.on("unfriend", async (sender) => {
        // console.log("unfriend-sender", sender);
        setFriends((prevFriend) => prevFriend.filter((item) => item.userId !== sender.sender.userId))
      })
      return () => {
        socket.off("accept-request-add-friend")
        socket.off("unfriend")
      }
    }
  }, [socket])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSection}>
        <Pressable
          style={styles.buttonRow}
          onPress={() => navigation.navigate("FriendRequest")}
        >
          <Ionicons name={"people-circle-sharp"} size={40} color={"#0091FF"} />
          <Text style={styles.buttonText}>Lời mời kết bạn</Text>
        </Pressable>
      </View>
      <View style={styles.buttonBar}>
        <Pressable style={styles.roundedButton}>
          <Text style={styles.whiteText}>Tất cả {totalFriends}</Text>
        </Pressable>
      </View>

      {/* List danh bạ nè */}
      <View style={styles.friendList}>
        <View style={styles.friendListHeader}>
          <Text style={styles.sectionTitle}>#</Text>
        </View>
        {friends.map((friend, index) => (
          <View key={index} style={styles.friendRow}>
            <Pressable
              style={styles.friendItem}
              onPress={() => handlePageNavigation(friend)}
            >
              <View style={styles.friendInfo}>
                <Image
                  source={{
                    uri:
                      friend?.profile?.avatar?.url ||
                      "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                  }}
                  style={styles.friendAvatar}
                />
                <Text style={styles.friendName}>{friend.profile.name}</Text>
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
                <Pressable
                  style={styles.actionIcon}
                  onPress={() => toggleModal(index, friend.phone)}
                >
                  <Ionicons
                    name={"ellipsis-vertical"}
                    size={25}
                    color={"black"}
                  />
                </Pressable>
              </View>
            </Pressable>
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(!modalVisible)}>
            <View
              style={[styles.centeredView, modalPosition, { position: "absolute", right: 10 }]}>
              <Pressable
                onPress={() => { handleUnFriend(); }}>
                <Text style={{ fontSize: 20, backgroundColor: "white" }}>
                  Hủy kết bạn
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </ScrollView>
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
    padding: 10,
    borderTopColor: "#e5e5e5",
    borderTopWidth: 0.5,
  },
  friendListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
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
});

export default FriendDirectory;