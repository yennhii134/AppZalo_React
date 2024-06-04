import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../api/axiosInstance";
import Toast from "react-native-toast-message";
import { useAuthContext } from "../../contexts/AuthContext";
import useMessage from "../../hooks/useMessage";
import useGroup from "../../hooks/useGroup";
import { useSocketContext } from "../../contexts/SocketContext";
import { useSelector } from "react-redux";
import avatarGroup from '../../../assets/avatarGroup.png'

const GroupDirectory = ({ navigation }) => {
  const [listFriends, setListFriends] = useState([])
  const [lengthGroup, setLengthGroup] = useState(0)
  const [modalCreateGr, setModalCreateGr] = useState(false)
  const [nameGroup, setNameGroup] = useState(null)
  const [textSearch, setTextSearch] = useState('')
  const [radioButton, setRadioButton] = useState([]);
  const [listSearch, setListSearch] = useState([])
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [groupAll, setGroupAll] = useState([])
  const { getGroups, createGroup } = useGroup()
  const { handleGetTimeInChat, setDataChat, showToastSuccess, showToastError, sortTime } = useMessage()
  const { authUser } = useAuthContext();
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  var isGroupRedux = useSelector(state => state.isGroup.isGroup);
  const [avatarGr] = useState(avatarGroup)
  const searchInputRef = useRef(null);
  const [isSearch, setIsSearch] = useState(false);

  const fetchGroup = async () => {
    try {
      const allGr = await getGroups();
      let dem = 0
      const newGroup = await Promise.all(allGr.map(async (group) => {
        dem++
        const dataChat = await setDataChat(group.lastMessage, false);
        return addDataToGroup(group, dataChat)
      }))

      sortTime(newGroup)
      setGroupAll(newGroup)
      setLengthGroup(dem)
    } catch (error) {
      console.log("FetchGroupError: ", error);
    }
  }
  const addDataToGroup = (group, dataChat) => {
    return {
      _id: group._id,
      conversation: group.conversation,
      lastMessage: group?.lastMessage || group.conversation.lastMessage,
      name: group.groupName,
      avatar: group.avatar.url,
      createBy: group.createBy,
      dataChat: dataChat,
      timeSend: handleGetTimeInChat(group?.lastMessage?.timestamp || group.conversation.createdAt),
      tag: group.conversation.tag,
    }
  }
  const fetchFriend = async () => {
    try {
      const response = await axiosInstance.get("/users/get/friends");
      if (response.status === 200) {
        setListFriends(response.data.friends)
        const newRadioButtons = response.data.friends.map(friend => ({
          _id: friend.userId,
          name: friend.profile.name,
          avatar: friend?.profile?.avatar?.url
        }))
        setRadioButton(newRadioButtons)
      } else if (response.status === 404) {
        console.log("getFriendError:");
      }
    } catch (error) {
      console.log("getFriendError:", error);
    }
  }

  useEffect(() => {
    fetchFriend()
    fetchGroup()
  }, [isGroupRedux])

  useEffect(() => {
    if (textSearch.trim() === '') {
      setListSearch([])
    }
    else {
      const filteredFriends = listFriends.filter((friend) => {
        return friend.profile.name.toLowerCase().includes(textSearch.toLowerCase()) || friend.phone === textSearch;
      });
      if (filteredFriends.length > 0) {
        const newRadioButtons = filteredFriends.map(friend => ({
          _id: friend.userId,
          name: friend.profile.name,
          avatar: friend?.profile?.avatar?.url
        }))
        setListSearch(newRadioButtons)
        setIsSearch(true)
      } else {
        setIsSearch(false)
      }
    }
  }, [textSearch])

  const handleFriendSelection = (item) => {
    if (selectedFriends.includes(item)) {
      setSelectedFriends(prevState => prevState.filter(friend => friend._id !== item._id));
    } else {
      setSelectedFriends(prevState => [...prevState, item]);
    }
  };
  const isFriendSelected = (friend) => {
    return selectedFriends.includes(friend);
  };
  const handleDeleteFriendSelected = (item) => {
    setSelectedFriends(selectedFriends.filter(friend => friend._id !== item._id));
  }
  useEffect(() => {
    if (selectedFriends.length < 2) {
      setIsHidden(false);
    } else {
      setIsHidden(true);
    }
  }, [selectedFriends]);

  const renderListItem = (item, index) => (
    <Pressable key={index} style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>
      <View style={{ height: 45, width: 45, borderRadius: 50 }}></View>
      <View style={{ width: "75%", flexDirection: 'row', alignItems: 'center' }}>

        <View style={{ padding: 10 }}>
          <Image
            source={{ uri: item.avatar || "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png" }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        </View>
        <Text style={{ fontWeight: "500", marginLeft: 0 }}>{item.name}</Text>
      </View>
      <Pressable
        onPress={() => {
          handleFriendSelection(item)
        }}
      >
        <View style={{ padding: 13, width: 24, height: 24, backgroundColor: '#F3F5F6', borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#37333A' }}>
          {isFriendSelected(item) ? (
            <Pressable style={{ width: 25, height: 25, backgroundColor: '#0091FF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} onPress={
              () => handleDeleteFriendSelected(item)
            }>
              <Ionicons color='white' size={27} name="checkmark-circle" />
            </Pressable>
          ) : (
            <View></View>
          )}
        </View>
      </Pressable>
    </Pressable>
  )

  const handleCreate = async () => {
    setIsLoading(true)
    if (!nameGroup) {
      showToastError("Vui lòng đặt tên nhóm")
      setIsLoading(false)
      return;
    }
    else {
      let idUser = [];
      for (const id of selectedFriends) {
        idUser.push(id._id)
      }
      try {
        const response = await createGroup(nameGroup, idUser)
        if (response) {
          setIsLoading(false)
          setNameGroup(null)
          setTextSearch('')
          setIsHidden(false)
          setSelectedFriends([])
          setModalCreateGr(false)
          fetchGroup()
          const group = {
            _id: response.group._id,
            name: response.group.groupName,
            createAt: handleGetTimeInChat(response.group.createAt),
            createBy: response.group.createBy,
            avatar: response.group.avatar.url,
            conversation: response.group.conversation,
            tag: response.group.conversation.tag,
          }
          navigation.navigate("Message", { chatItem: group })
        }
      } catch (error) {
        console.log("CreateGroupError:", error);
        setIsLoading(false)
      }
    }
  }
  const updatedListChats = async (conversationId, message, isDelete) => {
    const updatedListChats = await Promise.all(groupAll.map(async (item) => {
      if (item.conversation._id === conversationId) {
        const dataChat = await setDataChat(message, isDelete);
        return {
          ...item,
          lastMessage: message,
          dataChat: dataChat,
          timeSend: handleGetTimeInChat(message?.timestamp)
        };
      }
      return item;
    }));
    return updatedListChats;
  }
  useEffect(() => {
    const fetchSocket = async () => {
      if (isNewSocket === "new_message") {
        const message = newSocketData;
        if (message && message.retrunMessage) {
          // console.log("new_message:", message);
          const update = await updatedListChats(message.conversationId, message.retrunMessage, false)
          const sortUpdate = sortTime(update);
          setGroupAll(sortUpdate)
        }
      }
      if (isNewSocket === "delete_message") {
        const { chatRemove, conversationId, isDeleted } = newSocketData;
        if (chatRemove) {
          if (isDeleted) {

          } else {
            // console.log("delete_message:", chatRemove);
            const update = await updatedListChats(conversationId, chatRemove, true)
            setGroupAll(update)
          }
        }
      }
      if (isNewSocket === "add-to-group") {
        const data = newSocketData;
        if (data && data.addMembers) {
          // console.log("add-to-group", data)
          if (!groupAll.find(item => item._id === data.group._id)) {
            const group = data.group
            if (data.addMembers.includes(authUser._id) && group.createBy._id !== authUser._id) {
              showToastSuccess(`Bạn đã tham gia nhóm ${group.groupName}`)
              const addGroup = addDataToGroup(group, "Chưa có tin nhắn")
              const newListChats = [addGroup, ...groupAll]
              setGroupAll(newListChats);
              setNewSocketData(null);
            }
          }
        }
      }
      if (isNewSocket === "remove-from-group") {
        const group = newSocketData
        if (group && group.removeMembers) {
          // console.log("remove-from-group", group);
          if (group.removeMembers.includes(authUser._id)) {
            showToastSuccess(`Bạn đã bị xoá khỏi nhóm ${group.name}`)
            const updatedListChats = groupAll.filter(item => item._id !== group.id);
            setGroupAll(updatedListChats)
            setNewSocketData(null);
          }
        }
      }
      if (isNewSocket === "delete-group") {
        const group = newSocketData;
        // console.log("delete-group", group);
        if (group && group.name) {
          showToastSuccess(`Nhóm ${group.name} đã giải tán`)
          const updatedListChats = groupAll.filter(item => item._id !== group.id);
          setGroupAll(updatedListChats)
          setNewSocketData(null);
        }
      }
      if (isNewSocket === "update-group") {
        const group = newSocketData
        if (group && group.avatar) {
          // console.log("update-group", group);
          const groupUpdate = groupAll.map((item) => {
            if (item._id === group.id) {
              return {
                ...item,
                name: group.name,
                avatar: group.avatar
              }
            }
            return item;
          })
          setGroupAll(groupUpdate)
        }
      }
    }

    fetchSocket()
  }, [isNewSocket, newSocketData]);

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
            <Text style={styles.groupHeaderText}>Nhóm đang tham gia ({lengthGroup})</Text>
            <Pressable style={styles.sortButton}>
              <Ionicons
                name={"ios-swap-vertical-outline"}
                size={25}
                color={"#979797"}
              />
              <Text style={styles.sortButtonText}>Sắp xếp</Text>
            </Pressable>
          </View>
          {groupAll?.map((group, index) => (
            <Pressable key={index} style={styles.groupItem} onPress={() => navigation.navigate("Message", { chatItem: group })}>
              <Image
                source={group.avatar === "https://res.cloudinary.com/dq3pxd9eq/image/upload/group_avatar.jpg" ? avatarGr : { uri: group.avatar }}
                style={styles.avatar}
              />
              <View style={styles.groupTextContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Ionicons name="people" size={20} color="gray" />
                  <Text style={styles.groupTitle}>{group.name}</Text>
                </View>
                <Text style={styles.groupDescription} numberOfLines={1}>
                  {group.dataChat}
                </Text>
              </View>
              <Text style={styles.timeText}>{group.timeSend === "0 phút" ? "vừa xong" : `${group.timeSend} `}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCreateGr}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Toast />
            <View style={{ width: '100%', height: 50, alignItems: 'flex-end' }}>
              <Pressable style={styles.pressClose} onPress={() => { setModalCreateGr(false); setSelectedFriends([]), setNameGroup(null), setIsHidden(false) }}>
                <Ionicons name="close" size={30} color="black" />
              </Pressable>
            </View>
            <View style={styles.viewClose}>
              <Text style={{ fontWeight: '600', fontSize: 20 }}>Nhóm mới</Text>
              <Text style={{ color: '#979797', fontWeight: '600' }}>Đã chọn: {selectedFriends.length}</Text>
            </View>
            <View style={{ height: '7%', width: '80%', justifyContent: 'center' }}>
              <TextInput
                value={nameGroup}
                onChangeText={setNameGroup}
                placeholder="Đặt tên nhóm"
                placeholderTextColor='gray'
                style={{ fontSize: 18, height: '80%', width: '100%' }}
              >
              </TextInput>
            </View>
            <View style={styles.viewSearch}>
              <Pressable>
                <Ionicons name="search-outline" size={30} color="black" />
              </Pressable>
              <TextInput
                ref={searchInputRef}
                onChangeText={(text) => setTextSearch(text)}
                placeholder="Tìm tên hoặc số điện thoại"
                placeholderTextColor='gray'
                style={{ fontSize: 18, height: '80%', width: '80%', paddingHorizontal: 10 }}></TextInput>
              <Pressable onPress={() => {
                setTextSearch(''); setListSearch([]);
                if (searchInputRef.current) {
                  searchInputRef.current.clear();
                }
              }}>
                <Ionicons name="close-circle" size={30} color="gray" />
              </Pressable>
            </View>
            <View style={styles.viewScroll}>
              <ScrollView>
                {textSearch.trim() === '' ? (radioButton.map(renderListItem)
                ) : (
                  isSearch ? (listSearch.map(renderListItem)) : (<View></View>)
                )}
              </ScrollView>
              {isHidden ? (
                <View style={{ width: '95%', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 50 }}>
                  <Pressable
                    style={
                      { width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center", backgroundColor: "#0091FF" }}
                    onPress={handleCreate}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Image
                        style={{ width: 50, height: 50, }}
                        source={require("../../../assets/arrow.png")}
                      />
                    )}
                  </Pressable>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>


  );
};

const styles = StyleSheet.create({
  viewScroll: {
    paddingTop: 15,
    width: '100%',
    height: '75%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  viewSearch: {
    flexDirection: 'row',
    width: '85%',
    height: '7%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 5
  },
  pressClose: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewClose: {
    width: '100%',
    height: '7%',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '100%',
    height: '90%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 10,

  },
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
  sectionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    marginBottom: 10,
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