import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import useFriend from "../../hooks/useFriend";
import useConversation from "../../hooks/useConversation";
import { useSelector, useDispatch } from "react-redux";
import { useSocketContext } from "../../contexts/SocketContext";
import useToast from "../../hooks/useToast";
import { deleteFriend, selectFriends } from "../../redux/stateFriendsSlice";
import { SwipeListView } from 'react-native-swipe-list-view';

const FriendDirectory = ({ navigation }) => {
  const { handleFriendMessage } = useConversation();
  const { unFriend, getFriendById } = useFriend();
  const { showToastSuccess } = useToast()
  const { reloadAuthUser } = useAuthContext();
  const [modalUnFriend, setModalUnFriend] = useState(false);
  const [modalPosition, setModalPosition] = useState({});
  const [selectedFriendId, setSelectedFriendPhone] = useState(null);
  const { socket } = useSocketContext()
  const friends = useSelector(selectFriends);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isFriendTabActive, setIsFriendTabActive] = useState(true);

  const toggleModal = (index, friendId) => {
    setSelectedFriendPhone(friendId);
    setModalPosition({ top: index * 70 + 300 });
    setModalUnFriend(!modalUnFriend);
  };
  console.log("friends", friends);
  const handleUnFriend = async () => {
    if (!selectedFriendId) return;

    try {
      setIsLoading(true)
      const isUnFriend = await unFriend(selectedFriendId);
      if (isUnFriend) {
        showToastSuccess("Huỷ kết bạn thành công")
        dispatch(deleteFriend(selectedFriendId))
      }
    } catch (error) {
      console.log(error);
      showToastSuccess("Hủy kết bạn thất bại!");
    }
    setIsLoading(false)
    setModalUnFriend(false);
  };

  const handlePageNavigation = async (friend) => {
    const response = await handleFriendMessage(friend)
    navigation.navigate("Message", { chatItem: response });
  };

  useEffect(() => {
    if (socket) {
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


  const renderFriend = ({ index, item }) => (
    <View style={styles.friendRow}>
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
          <Pressable
            style={styles.actionIcon}
            onPress={() => toggleModal(index, item.userId)}
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
  )

  const renderChoose = () => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnLeft]}>
          <Text style={styles.backTextWhite}>Thêm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]}>
          <Text style={styles.backTextWhite}>Xoá</Text>
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
        </Pressable>
      </View>
      <View style={styles.buttonBar}>
        <Pressable style={styles.roundedButton}>
          <Text style={styles.whiteText}>Tất cả {friends.length}</Text>
        </Pressable>
      </View>

      {/* List danh bạ nè */}
      <View style={styles.friendList}>
        <View style={styles.friendListHeader}>
          <Text style={styles.sectionTitle}>#</Text>
        </View>
        <SwipeListView
          data={friends}
          renderItem={renderFriend}
          renderHiddenItem={renderChoose}
          rightOpenValue={-225}
          disableRightSwipe={!isFriendTabActive} // disable khi tab không active

        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalUnFriend}
          onRequestClose={() => setModalUnFriend(!modalUnFriend)}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalUnFriend(!modalUnFriend)}>
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
    </View>
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
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
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
  },
});

export default FriendDirectory;
