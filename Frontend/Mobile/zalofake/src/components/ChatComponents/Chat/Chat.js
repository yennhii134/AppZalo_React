import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  SafeAreaView
} from "react-native";
import ChatItem from "./ChatItem";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useSocketContext } from "../../../contexts/SocketContext";
import useMessage from '../../../hooks/useMessage'
import { useSelector } from "react-redux";
import CreateGroup from "../../ModalComponents/CreateGroup";
import useConversation from "../../../hooks/useConversation";
import useGroup from "../../../hooks/useGroup";
import { selectIsUpdateConversation } from "../../../redux/stateUpdateConversationSlice";
import useToast from "../../../hooks/useToast";
import { selectIsUpdateGroup } from "../../../redux/stateUpdateGroupSlice";
import useSocket from "../../../hooks/useSocket";

function Chat({ navigation }) {
  // Fetch API
  const { authUser } = useAuthContext();
  const { groups, getGroups } = useGroup()
  const { getConversations, conversations, handleMessageNavigation } = useConversation();
  const { handleGetTimeInChat, setDataChat, sortTime } = useMessage();
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  const { showToastSuccess } = useToast()
  const { fetchSocket } = useSocket();

  // Redux
  var isUpdateConversation = useSelector(selectIsUpdateConversation);
  var isUpdateGroup = useSelector(selectIsUpdateGroup);
  const [isModalVisible, setModalVisible] = useState(false);
  const [chats, setChats] = useState([])
  const [isModalCreateGroup, setIsModalCreateGroup] = useState(false)
  const [groupReponse, setGroupResone] = useState(null)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Pressable style={styles.headerIcon}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={22}
              color="white"
            />
          </Pressable>
          <Pressable
            onPress={() => setModalVisible(!isModalVisible)}
            style={styles.headerIcon}
          >
            <Ionicons name="apps-outline" size={24} color="white" />
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
            focusable={false}
            style={{
              height: 45,
              width: 200,
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

  useEffect(() => {
    getConversations();
    getGroups();
  }, [isUpdateConversation, isUpdateGroup])

  const fetchDataChat = async () => {
    const listConversation = conversations
      .filter((conversation) => conversation.lastMessage !== null)
      .map((conversation) => {
        const friend = conversation.participants.find(
          (participant) => participant._id !== authUser._id
        );
        const chatData = setDataChat(conversation.lastMessage, friend, false)
        return {
          _id: friend._id,
          conversation: conversation,
          chatName: friend.profile.name,
          avatar: friend.profile.avatar.url,
          lastMessage: conversation?.lastMessage,
          chatData: chatData,
          time: handleGetTimeInChat(conversation.lastMessage.timestamp),
          tag: conversation.tag,
        };
      });

    const listConverGroup = groups.map((group) => {
      const friend = group.conversation.participants.find(
        (participant) => participant._id === group.lastMessage.senderId
      )
      const chatData = setDataChat(group.lastMessage, friend, false)
      return {
        _id: group._id,
        conversation: group.conversation,
        chatName: group.groupName,
        avatar: group.avatar.url,
        lastMessage: group.lastMessage,
        chatData: chatData,
        time: handleGetTimeInChat(group.lastMessage.timestamp),
        tag: group.conversation.tag,
      };
    });
    listConversation.push(...listConverGroup);
    sortTime(listConversation)
    setChats(listConversation);
  };

  useEffect(() => {
    fetchDataChat()
  }, [groups, conversations]);

  const handleUpdateChats = async (conversationId, retrunMessage, isDelete) => {
    const updateChat = await Promise.all(chats.map(async (chat) => {
      if (chat.conversation._id === conversationId) {
        const friend = chat.conversation.participants.find((participant) => participant._id === retrunMessage.senderId)
        const chatData = await setDataChat(retrunMessage, friend, isDelete);
        return {
          ...chat,
          lastMessage: retrunMessage,
          chatData: chatData,
          time: handleGetTimeInChat(retrunMessage?.timestamp)
        };
      }
      return chat;
    }));
    return updateChat;
  }

  useEffect(() => {
    // const fetchSocket = async () => {
    //   if (isNewSocket === "add-to-group") {
    //     const data = newSocketData;
    //     if (data && data.addMembers) {
    //       // console.log("add-to-group", data)
    //       if (!listFriends.find(item => item.chat._id === data.group._id)) {
    //         const group = data.group
    //         if (data.addMembers.includes(authUser._id) && group.createBy._id !== authUser._id) {
    //           console.log(`Bạn đã tham gia nhóm ${group.groupName}`);
    //           showToastSuccess(`Bạn đã tham gia nhóm ${group.groupName}`)
    //           const addGroup = addDataToGroup(group)
    //           let dataChat
    //           if (addGroup?.lastMessage?.senderId) {
    //             dataChat = setDataChat(addGroup.lastMessage, false);
    //           }
    //           const conversationNew = {
    //             chat: addGroup,
    //             dataChat: dataChat || 'Chưa có tin nhắn',
    //             time: handleGetTimeInChat(addGroup?.lastMessage?.timestamp || addGroup.createAt)
    //           };
    //           const newListFriends = [conversationNew, ...listFriends]
    //           setListFriends(newListFriends);
    //           // setNewSocketData(null);
    //         }
    //       }
    //     }
    //   }

    //   if (isNewSocket === "remove-from-group") {
    //     const group = newSocketData
    //     if (group && group.removeMembers) {
    //       // console.log("remove-from-group", group);
    //       if (group.removeMembers.includes(authUser._id)) {
    //         console.log(`Bạn đã bị xoá khỏi nhóm ${group.name}`);
    //         showToastSuccess(`Bạn đã bị xoá khỏi nhóm ${group.name}`)
    //         const updatedConversationList = listFriends.filter(item => item.chat._id !== group.id);
    //         setListFriends(updatedConversationList)
    //         // setNewSocketData(null);
    //       }
    //     }
    //   }
    //   if (isNewSocket === "delete-group") {
    //     const group = newSocketData;
    //     // console.log("delete-group", group);
    //     if (group && group.name) {
    //       showToastSuccess(`Nhóm ${group.name} đã giải tán`)
    //       const updatedConversationList = listFriends.filter(item => item.chat._id !== group.id);
    //       setListFriends(updatedConversationList)
    //       // setNewSocketData(null);
    //     }
    //   }
    //   if (isNewSocket === "update-group") {
    //     const group = newSocketData
    //     if (group && group.avatar) {
    //       // console.log("update-group", group);
    //       const groupUpdate = listFriends.map((item) => {
    //         if (item.chat._id === group.id) {
    //           return {
    //             ...item,
    //             chat: {
    //               ...item.chat,
    //               name: group.name,
    //               avatar: group.avatar
    //             }
    //           }
    //         }
    //         return item;
    //       })
    //       setListFriends(groupUpdate)
    //     }
    //   }
    // }
    const handleFetchSocket = async () => {
      const chatsUpdate = await fetchSocket(isNewSocket, newSocketData, chats)
      setChats(chatsUpdate)
    }
    handleFetchSocket()

  }, [isNewSocket, newSocketData]);

  const handleChatItemPress = (item) => {
    navigation.navigate("Message", { chatItem: item });
  };

  useEffect(() => {
    const handleNavigation = async () => {
      if (groupReponse) {
        const chatItem = await handleMessageNavigation(groupReponse)
        navigation.navigate("Message", { chatItem: chatItem });
      }
    }
    handleNavigation()
  }, [groupReponse])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleChatItemPress(item)}>
            <ChatItem item={item} />
          </Pressable>
        )}
        keyExtractor={(item) => item._id}
      />
      {/* Modal Tạo nhóm mới */}
      {isModalCreateGroup &&
        <CreateGroup
          isOpen={isModalCreateGroup}
          isClose={(close) => setIsModalCreateGroup(close)}
          setGroup={(groupReponse) => setGroupResone(groupReponse)} />
      }
      {/* Modal Tiện ích */}
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(!isModalVisible)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignItems: "flex-end",
            marginEnd: 10,
            marginTop: 10,
          }}
          onPress={() => setModalVisible(!isModalVisible)}
        >
          <View
            style={{ backgroundColor: "white", padding: 10, borderRadius: 10 }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
              onPress={() => {
                navigation.navigate("AddFriends");

                setModalVisible(!isModalVisible);
              }}
            >
              <Ionicons
                name="person-add-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Thêm bạn</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
              onPress={() => {
                setIsModalCreateGroup(!isModalCreateGroup);
                setModalVisible(!isModalVisible);
              }}
            >
              <Ionicons
                name="people-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Tạo nhóm</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Ionicons
                name="cloud-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Cloud của tôi</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Ionicons
                name="calendar-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Lịch Zalo</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Ionicons
                name="videocam-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Tạo cuộc gọi nhóm</Text>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
              }}
            >
              <Ionicons
                name="desktop-outline"
                size={22}
                color="grey"
                style={{ marginRight: 10 }}
              />
              <Text>Thiết bị đăng nhập</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal >
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalButtonContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  headerIcon: {
    padding: 10,
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
  button: {
    backgroundColor: "#fff",
  },
  pressedButton: {
    backgroundColor: "#33c4c2",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
  },
  modalHeaderText: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#0091FF",
  },
  pressCol: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default Chat;