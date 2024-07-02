import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useGroup from "../../hooks/useGroup";
import { useSocketContext } from "../../contexts/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../hooks/useToast";
import CreateGroup from "../ModalComponents/CreateGroup";
import { selectIsUpdateGroup } from "../../redux/stateUpdateGroupSlice";
import useConversation from "../../hooks/useConversation";
import useSocket from "../../hooks/useSocket";

const GroupDirectory = ({ navigation }) => {
  // Fetch Api
  const { getGroups, groups } = useGroup()
  const { handleGetTimeInChat, setDataChat, sortTime } = useMessage()
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  const { authUser } = useAuthContext();
  const { showToastSuccess } = useToast();
  const { handleMessageNavigation } = useConversation();
  const { fetchSocket } = useSocket();

  const [modalCreateGr, setModalCreateGr] = useState(false)
  const [chats, setChats] = useState([])
  var isUpdateGroup = useSelector(selectIsUpdateGroup);
  const [groupReponse, setGroupResone] = useState(null)

  useEffect(() => {
    getGroups();
  }, [isUpdateGroup])

  const fetchGroup = async () => {
    try {
      const newGroup = await Promise.all(groups.map(async (group) => {
        const friend = group.conversation.participants.find(
          (participant) => participant._id === group.lastMessage.senderId
        )
        const dataChat = setDataChat(group.lastMessage, friend, false);
        return addDataToGroup(group, dataChat)
      }))

      sortTime(newGroup)
      setChats(newGroup)
    } catch (error) {
      console.log("Fetch Group Error: ", error);
    }
  }
  const addDataToGroup = (group, dataChat) => {
    return {
      _id: group._id,
      conversation: group.conversation,
      chatName: group.groupName,
      avatar: group.avatar.url,
      lastMessage: group.lastMessage || group.conversation.lastMessage,
      createBy: group.createBy,
      chatData: dataChat,
      time: handleGetTimeInChat(group?.lastMessage?.timestamp || group.conversation.createdAt),
      tag: group.conversation.tag,
    }
  }

  useEffect(() => {
    fetchGroup()
  }, [groups])

  const updatedListChats = async (conversationId, message, isDelete) => {
    const updatedListChats = await Promise.all(chats.map(async (chat) => {
      if (chat.conversation._id === conversationId) {
        const dataChat = await setDataChat(message, isDelete);
        return {
          ...chat,
          lastMessage: message,
          dataChat: dataChat,
          timeSend: handleGetTimeInChat(message?.timestamp)
        };
      }
      return chat;
    }));
    return updatedListChats;
  }
  useEffect(() => {
    // const fetchSocket = async () => {
    //   if (isNewSocket === "add-to-group") {
    //     const data = newSocketData;
    //     if (data && data.addMembers) {
    //       // console.log("add-to-group", data)
    //       if (!chats.find(item => item._id === data.group._id)) {
    //         const group = data.group
    //         if (data.addMembers.includes(authUser._id) && group.createBy._id !== authUser._id) {
    //           showToastSuccess(`Bạn đã tham gia nhóm ${group.groupName}`)
    //           const addGroup = addDataToGroup(group, "Chưa có tin nhắn")
    //           const newListChats = [addGroup, ...chats]
    //           setChats(newListChats);
    //           setNewSocketData(null);
    //         }
    //       }
    //     }
    //   }
    //   if (isNewSocket === "remove-from-group") {
    //     const group = newSocketData
    //     if (group && group.removeMembers) {
    //       // console.log("remove-from-group", group);
    //       if (group.removeMembers.includes(authUser._id)) {
    //         showToastSuccess(`Bạn đã bị xoá khỏi nhóm ${group.name}`)
    //         const updatedListChats = chats.filter(item => item._id !== group.id);
    //         setChats(updatedListChats)
    //         setNewSocketData(null);
    //       }
    //     }
    //   }
    //   if (isNewSocket === "delete-group") {
    //     const group = newSocketData;
    //     // console.log("delete-group", group);
    //     if (group && group.name) {
    //       showToastSuccess(`Nhóm ${group.name} đã giải tán`)
    //       const updatedListChats = chats.filter(item => item._id !== group.id);
    //       setChats(updatedListChats)
    //       setNewSocketData(null);
    //     }
    //   }
    //   if (isNewSocket === "update-group") {
    //     const group = newSocketData
    //     if (group && group.avatar) {
    //       // console.log("update-group", group);
    //       const groupUpdate = chats.map((item) => {
    //         if (item._id === group.id) {
    //           return {
    //             ...item,
    //             name: group.name,
    //             avatar: group.avatar
    //           }
    //         }
    //         return item;
    //       })
    //       setChats(groupUpdate)
    //     }
    //   }
    // }

    // fetchSocket()

    const handleFetchSocket = async () => {
      const chatsUpdate = await fetchSocket(isNewSocket, newSocketData, chats)
      console.log("chatsUpdate",chatsUpdate);
      setChats(chatsUpdate)
    }
    handleFetchSocket()
  }, [isNewSocket, newSocketData]);

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
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Pressable style={styles.item} onPress={() => setModalCreateGr(true)}>
            <Image
              style={styles.icon}
              resizeMode="contain"
              source={require("../../../assets/createGroup.png")}
            />
            <Text style={styles.itemText}>Tạo nhóm mới</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupHeaderText}>Nhóm đang tham gia ({chats.length})</Text>
            <Pressable style={styles.sortButton}>
              <Ionicons
                name={"swap-vertical"}
                size={25}
                color={"#979797"}
              />
              <Text style={styles.sortButtonText}>Sắp xếp</Text>
            </Pressable>
          </View>
          {chats?.map((group, index) => (
            <Pressable key={index} style={styles.groupItem} onPress={() => navigation.navigate("Message", { chatItem: group })}>
              <Image
                source={{ uri: group.avatar }}
                style={styles.avatar}
              />
              <View style={styles.groupTextContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Ionicons name="people" size={20} color="gray" />
                  <Text style={styles.groupTitle}>{group.chatName}</Text>
                </View>
                <Text style={styles.groupDescription} numberOfLines={1}>
                  {group.chatData}
                </Text>
              </View>
              <Text style={styles.timeText}>{group.time === "0 phút" ? "vừa xong" : `${group.time} `}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {modalCreateGr &&
        <CreateGroup
          isOpen={modalCreateGr}
          isClose={(close) => setModalCreateGr(close)}
          setGroup={(groupReponse) => setGroupResone(groupReponse)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 10,
    // alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  featureItem: {
    alignItems: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  featureText: {
    marginTop: 5,
    fontSize: 14,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  groupHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#979797",
  },
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  groupTextContainer: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    height: 30,
    paddingLeft: 10,
  },
  groupDescription: {
    fontSize: 14,
    color: "#979797",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#979797",
  },
});

export default GroupDirectory;