import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView, ActivityIndicator, Modal,
  Image,
  Linking,
} from "react-native";
import { Video } from 'expo-av';
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "../../../api/axiosInstance";
import useMessage from '../../../hooks/useMessage'
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSocketContext } from "../../../contexts/SocketContext"
import useGroup from "../../../hooks/useGroup";
import { useAuthContext } from "../../../contexts/AuthContext";
import * as DocumentPicker from 'expo-document-picker';
import useConversation from "../../../hooks/useConversation";
import { useSelector, useDispatch } from "react-redux";
import { setIsGroup } from "../../../redux/stateCreateGroupSlice";
import avatarGroup from '../../../../assets/avatarGroup.png'

const Message = ({ navigation, route }) => {
  const { chatItem } = route.params;
  const [conver, setConver] = useState(chatItem)
  const { getGroups, getUserById } = useGroup()
  const { authUser } = useAuthContext()
  const [textMessage, setTextMessage] = useState(null)
  const [isColorSend, setIsColorSend] = useState(false)
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  const { getConversationByID } = useConversation();
  const dispatch = useDispatch();
  var isGroupRedux = useSelector(state => state.isGroup.isGroup);
  const [modalImage, setModalImage] = useState(false);
  const [chats, setChats] = useState([]);
  const scrollViewRef = useRef();
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { renderMessageContent, renderMessageContentReply, showToastSuccess, showToastError, handleGetTimeInMessage, addMessage, sendMessage } = useMessage();
  const [isModalVisible, setModalVisible] = useState(false);
  const [messageSelected, setMessageSelected] = useState("");
  const [isModalFriendVisible, setIsModalFriendVisible] = useState(false);
  const [friends, setFriends] = useState([]);
  const [isLoadMess, setIsLoadMess] = useState(false)
  const [isLoadChuyenTiep, setIsLoadChuyenTiep] = useState(false)
  const [isLoadThuHoi, setIsLoadThuHoi] = useState(false)
  const [isLoadXoa, setIsLoadXoa] = useState(false)
  const [replyChat, setReplyChat] = useState(null);
  const [avatarGr] = useState(avatarGroup)

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => console.log("Pressed call")}>
            <Ionicons
              name="call-outline"
              size={27}
              color="white"
              style={{ padding: 4, paddingStart: 10 }}
            />
          </Pressable>
          <Ionicons
            name="videocam-outline"
            size={27}
            color="white"
            style={{ padding: 4, marginRight: 10 }}
          />
          <Pressable
            onPress={() => navigation.navigate("MessageSettings", { item: conver })}
          >
            <Ionicons
              name="list-outline"
              size={27}
              color="white"
              style={{ padding: 4 }}
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center", width: '55%', marginRight: 200 }}>
          {conver.tag === 'group' && (
            <View style={{ width: '30%' }}>
              <Image
                source={conver.avatar === "https://res.cloudinary.com/dq3pxd9eq/image/upload/v1715763881/Zalo_Fake_App/qhncxk41jtp39iknujyz.png" ? avatarGr : { uri: conver.avatar }}
                style={{ width: 45, height: 40, borderRadius: 25 }}
              />
            </View>
          )}
          <Text style={{ fontSize: 19, color: "white", fontWeight: 'bold' }}>{conver.name}</Text>
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
  }, [navigation, isGroupRedux]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalFriend = () => {
    setIsModalFriendVisible(!isModalFriendVisible);
  };

  const fetchConversation = async () => {
    if (chatItem.conversation !== null) {
      const fetchConver = await getConversationByID(chatItem.conversation?._id)
      setConver({ ...conver, participants: fetchConver.participants, messages: fetchConver.messages })
    }
  }
  useEffect(() => {
    fetchConversation()
  }, [isGroupRedux])

  useEffect(() => {
    if (isLoad === true) {
      scrollToEnd();
    }
  }, [isLoad]);

  useEffect(() => {
    if (conver && conver.messages) {
      fetchChats();
    }
  }, [conver]);

  const fetchChats = async () => {
    try {
      if (conver && conver.messages) {
        const chatNew = await Promise.all(conver.messages.map(async (message) => {
          let senderName
          let nameReply
          if (conver.participants.find((participant) => participant._id === message.senderId)) {
            senderName = conver.participants.find((participant) => participant._id === message.senderId)
          } else {
            const getUser = await getUserById(message.senderId)
            senderName = getUser.user
          }
          if (message.replyMessageId !== null) {
            if (conver.participants.find((participant) => participant._id === message.replyMessageId.senderId)) {
              nameReply = conver.participants.find((participant) => participant._id === message.replyMessageId.senderId)
            } else {
              const getUser = await getUserById(message.replyMessageId.senderId)
              nameReply = getUser.user
            }
          }
          return {
            chat: message,
            sender: senderName,
            nameReply: nameReply?.profile.name || null
          }
        }))
        setChats(chatNew);
        setIsLoad(true);
        fetchFriends();
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const fetchFriends = async () => {
    let data = []
    try {
      const response = await axiosInstance.get('/users/get/friends');
      const newFriend = await Promise.all(response.data.friends.map(async (friend) => {
        return {
          _id: friend.userId,
          name: friend.profile.name,
          avatar: friend.profile.avatar.url || "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
          tag: 'friend'
        }
      }))
      data.push(...newFriend)
    } catch (error) {
      console.log("FetchGroupError: ", error);
    }
    try {
      const allGr = await getGroups();
      const newGroup = await Promise.all(allGr.map(async (group) => {
        return {
          _id: group._id,
          name: group.groupName,
          avatar: group.avatar.url,
          tag: group.conversation.tag
        }
      }))
      data.push(...newGroup)
    } catch (error) {
      console.log("FetchGroupError: ", error);
    }
    setFriends(data)

  };
  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }

  useEffect(() => {
    const fetchSocket = async () => {

      if (isNewSocket === "new_message") {
        const message = newSocketData;
        if (message && message.retrunMessage) {
          // console.log("socket new messagae", message);
          if (
            message.conversationId === conver.conversation._id &&
            message.retrunMessage.receiverId === authUser._id && message.retrunMessage.senderId !== authUser._id
          ) {
            setChat(message.retrunMessage)
            scrollToEnd()
          }
        }
      }
      if (isNewSocket === "delete_message") {
        console.log("delete");
        const { conversationId, isDeleted } = newSocketData;
        console.log(("conversationId", conversationId));
        console.log("isDeleted", isDeleted);
        if (isDeleted && conver && conver.conversation._id === conversationId) {
          setChats([])
        } else {
          if (conver && conver.conversation._id === conversationId) {
            fetchConversation()
            console.log("socket delete messagae");
          }
        }
      }
      if (isNewSocket === "remove-from-group") {
        // console.log("newSocketData",newSocketData);
        const group = newSocketData
        if (group && group.removeMembers) {
          if (group.removeMembers.includes(authUser._id)) {
            navigation.navigate("ChatComponent");
            setNewSocketData(null)
          }
        }
      }
      if (isNewSocket === "delete-group") {
        // console.log("delete-group in message", newSocketData);
        const group = newSocketData
        if (group && group.id === conver._id) {
          navigation.navigate("ChatComponent");
          setNewSocketData(null)
        }
      }
      if (isNewSocket === "update-group") {
        const group = newSocketData
        if (group && group.id === conver._id) {
          // console.log("update-group",group);
          setConver(preConver => ({
            ...preConver,
            name: group.name,
            avatar: group.avatar
          }))
          dispatch(setIsGroup())
        }
      }

    }
    fetchSocket()
  }, [isNewSocket, newSocketData]);
  // useEffect(() => {
  //   // if (scrollViewRef.current && contentHeight > scrollViewHeight && !isLoad) {
  //   //   const offset = contentHeight - scrollViewHeight;
  //   //   setIsLoad(true)
  //   //   scrollViewRef.current.scrollTo({ x: 0, y: offset, animated: true });
  //   // }

  // }, [contentHeight, scrollViewHeight]);


  // // Khôi phục vị trí cuộn của ScrollView
  // const restoreScrollPosition = () => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.measure((x, y, width, height, pageX, pageY) => {
  //       scrollViewRef.current.scrollTo({ x: 0, y: height + scrollViewHeight, animated: false });

  //     });
  //   }
  // };
  // const handleScrollToTop = () => {
  //   setIsLoading(true)
  //   const fetchChats = async () => {
  //     try {
  //       // const response = await axiosInstance.get(`/chats/getHistoryMessage/${user._id}?lastTimestamp=${lastTimestamp}`);
  //       const response = await axiosInstance.get(`/conversations/get/messages/${conver.conversation._id}`);
  //       const reversedChats = response.data;//.reverse();

  //       // if (reversedChats && reversedChats.length > 0) {
  //       //   setChats(prevChats => [...reversedChats, ...prevChats]);
  //       //   restoreScrollPosition();
  //       //   const lastElement = reversedChats[0]
  //       //   setLastTimestamp(lastElement.timestamp)
  //       // }
  //       setIsLoading(false)

  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchChats();

  // };
  // const handleScroll = (event) => {
  //   const { y } = event.nativeEvent.contentOffset;
  //   if (y === 0) {
  //     handleScrollToTop();
  //   }
  // };
  const handlePressIn = (message) => {
    setMessageSelected(message)
    setModalVisible(true)
  };

  const removeItemById = (array, idToRemove) => {
    const indexToRemove = array.findIndex(item => item._id === idToRemove);
    if (indexToRemove !== -1) {
      array.splice(indexToRemove, 1);
    }
    return array;
  };
  const handleDeleteMess = () => {
    setIsLoadThuHoi(true)
    handleDelete(`/chats/${messageSelected.chat._id}/delete`, "Thu hồi thành công")
  };
  const handleDeleteMessByStatus = () => {
    setIsLoadXoa(true)
    handleDelete(`conversations/deleteOnMySelf/${conver.conversation._id}/${messageSelected.chat._id}`, "Xóa thành công")
  };

  const handleDelete = async (api, toast) => {
    try {
      const response = await axiosInstance.post(api)
      if (response.status === 200) {
        fetchConversation()
        showToastSuccess(toast)
        setIsLoadXoa(false)
        setIsLoadThuHoi(false)
        toggleModal()
      }
    } catch (error) {
      console.log(error);
      setIsLoadThuHoi(false)
      setIsLoadThuHoi(false)
      toggleModal()
    }
  }
  const handleGetModalFriend = () => {
    toggleModal();
    toggleModalFriend();
  };

  const chuyenTiepChat = (friend) => {
    setIsLoadChuyenTiep(true)
    const handleSendMessage = async () => {
      try {
        const messagae = {
          data: messageSelected.chat.contents[0],
          replyMessageId: replyChat !== null ? replyChat.chat._id : null,
          isGroup: friend.tag === "group" ? true : false
        }
        const send = await sendMessage(friend._id, messagae, 'sendText')
        if (send) {
          showToastSuccess("Chuyển tiếp thành công")
          setIsLoadChuyenTiep(false)
        } else {
          showToastError("Chuyển tiếp thất bại")
        }
      } catch (error) {
        console.log("error1:", error)
        setIsLoadChuyenTiep(false)
        return false;
      }
      toggleModalFriend();
    }
    handleSendMessage();
  };

  const appendData = (formData, asset) => {
    const fileName = asset.uri.split('/').pop();
    let type = null
    if (asset?.type === 'image') { type = 'image/jpeg' }
    else if (asset?.type === 'video') { type = 'video/mp4' }
    else if (asset?.mimeType === 'application/pdf') { type = 'file/pdf' }
    formData.append('data[]', {
      uri: asset.uri,
      name: fileName,
      type: type,
    })
  }
  const appendIs = (formData, tag) => {
    formData.append('isGroup', tag === 'group' ? true : false)
    formData.append('replyMessageId', replyChat !== null ? replyChat.chat._id : null)
  }
  const setChat = async (dataChat) => {
    let nameReply = null
    let senderName = authUser
    if (dataChat.replyMessageId) {
      nameReply = conver.participants.find((participant) => participant._id === dataChat.replyMessageId.senderId)
      if (!nameReply) {
        const getUser = await getUserById(dataChat.replyMessageId.senderId)
        nameReply = getUser.user
      }
    }
    if (dataChat.senderId !== authUser._id) {
      senderName = conver.participants.find(sender => sender._id === dataChat.senderId)
    }
    setChats(prevChats => [
      ...prevChats,
      {
        chat: dataChat,
        sender: senderName,
        nameReply: nameReply?.profile?.name
      }
    ]);
  }
  const send = async (user, formData, typeSend) => {
    setIsLoadMess(true)
    try {
      const response = await sendMessage(user, formData, typeSend)
      if (response && response.status === 201) {
        console.log(`${typeSend} success`);
        setChat(response.data.data.message)
        setReplyChat(null);
        setIsLoadMess(false)
        dispatch(setIsGroup())
        scrollToEnd();
      } else {
        console.log(`${typeSend} fail`);
        setIsLoadMess(false)
      }
    } catch (error) {
      console.log(`Send ${typeSend} error:`, error);
      setIsLoadMess(false)
    }
  }
  const pickFile = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();
      if (file.canceled === false) {
        handleSendFile(file, 'sendFiles')
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };
  const openImagePicker = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 20,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
      videoMaxDuration: 10
    });

    if (!pickerResult.canceled) {
      handleSendFile(pickerResult, 'sendImages')
    }
  }
  const handleSendFile = async (file, typeSend) => {
    const formData = new FormData()
    const formDataVideo = new FormData()
    let isVideo = false
    let is = false
    for (const asset of file.assets) {
      if (asset.type === 'video') {
        appendData(formDataVideo, asset)
        isVideo = true
      }
      else {
        appendData(formData, asset)
        is = true
      }
    }
    if (is) {
      appendIs(formData, conver.tag)
      send(conver._id, formData, typeSend)
    }
    if (isVideo) {
      appendIs(formDataVideo, conver.tag)
      send(conver._id, formDataVideo, 'sendVideo')
    }
  }
  useEffect(() => {
    // Update send button color based on textMessage
    if (!textMessage) {
      setIsColorSend("black");
    } else {
      setIsColorSend("#0091FF");
    }
  }, [textMessage]);

  const handleSendMessage = async () => {
    if (textMessage) {
      send(conver._id, addMessage(textMessage, conver.tag, replyChat), 'sendText')
      setTextMessage(null);
    }
  }
  const handleCheckIsSend = (message) => {
    if (authUser.profile.name === message.sender.profile.name) {
      return true;
    } else {
      return false;
    }
  };

  const handleCheckShow = (message) => {
    if (message.sender._id === authUser._id) {
      if (message.chat.status === 0 || message.chat.status === 2) {
        return true;
      } else {
        return false;
      }
    } else {
      if (message.chat.status === 0 || message.chat.status === 1) {
        return true;
      } else {
        return false;
      }
    }
  };
  const handleReplyChat = () => {
    setReplyChat(messageSelected);
    toggleModal();
  };
  const handleXemAnh = () => {
    setModalImage(true)
  };
  const handleXemFile = async () => {
    const url = messageSelected?.chat?.contents[0].data;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E9EB" }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {isLoading ? (
          <ActivityIndicator color="blue" size="large" />
        ) : (
          <View></View>
        )}
        <ScrollView ref={scrollViewRef}
        >
          <View style={{ flex: 1 }}>
            {chats.length > 0 ?
              (chats.map((message, index) => (
                <View key={index}>
                  {
                    handleCheckShow(message) && (
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: handleCheckIsSend(message) ? "flex-end" : "flex-start" }} >
                        {handleCheckIsSend(message) ?
                          (<View></View>) :
                          (<View
                            style={{ width: 35, height: 35, justifyContent: "center", alignItems: "center", marginLeft: 10, marginRight: 10 }} >
                            <Image
                              source={{ uri: message.sender.profile.avatar.url || "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png" }}
                              style={{ width: 35, height: 35, borderRadius: 25 }}
                            />
                          </View>)}
                        <View style={[
                          handleCheckIsSend(message) ? styles.styleSender : styles.styleRecive
                        ]}>
                          <Text style={{ paddingHorizontal: 10, fontSize: 12, color: 'gray', fontWeight: '700' }}>
                            {message.sender.profile.name}
                          </Text>
                          {message.chat.replyMessageId === null ? (<View></View>) :
                            (<View style={{ backgroundColor: '#89D5FB', display: 'flex', marginLeft: 10, borderLeftWidth: 2, borderColor: '#0072AB', marginRight: 10 }}>

                              {message.chat.replyMessageId.contents.map((content, i) => (
                                <View key={i} style={{ display: 'flex', paddingVertical: 10, alignItems: 'center', }}>
                                  {content.type === 'text' ? (
                                    <View>
                                      <Text style={{ fontSize: 13, fontWeight: 'bold', paddingLeft: 15 }}>
                                        {message?.nameReply}
                                      </Text>
                                      {renderMessageContentReply(content)}
                                    </View>
                                  ) : (
                                    <View style={{ display: 'flex', paddingVertical: 5, alignItems: 'center', paddingRight: 5, flexDirection: 'row' }}>
                                      {renderMessageContentReply(content)}
                                      <View>
                                        <Text style={{ paddingLeft: 10, fontSize: 13, fontWeight: 'bold' }}>
                                          {message?.nameReply}
                                        </Text>
                                        <Text style={{ paddingLeft: 10, fontSize: 13, color: '#000' }}>
                                          [{content.type === 'image' ? 'Hình ảnh' : content.type}]
                                        </Text>
                                      </View>
                                    </View>
                                  )}
                                </View>
                              ))}
                            </View>)
                          }
                          {message.chat.contents.map((content, i) => (
                            <Pressable key={i}
                              onPress={() => handlePressIn(message)}>
                              <View>
                                {renderMessageContent(content)}
                                <View style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 5 }}><Text style={{ fontSize: 14 }}>{handleGetTimeInMessage(message.chat.timestamp)}</Text></View>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )
                  }
                </View>
              ))) : (<View><Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', paddingVertical: 10 }}>Chưa có tin nhắn nào!</Text></View>)}

          </View>
        </ScrollView>
      </View >
      <View>
        {replyChat === null ?
          (<Text></Text>) :
          (
            <View style={{ backgroundColor: 'white', padding: 10 }}>
              <View style={{ borderLeftWidth: 2, marginLeft: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ paddingLeft: 15, fontSize: 14, color: '#000' }}>
                    Trả lời: <Text style={{ paddingLeft: 15, fontSize: 14, color: 'gray', fontWeight: 'bold' }}>{replyChat?.sender?.profile.name} </Text>
                  </Text>
                  <Pressable onPress={() => { setReplyChat(null) }} style={{ marginRight: 20 }}><Ionicons name="close" size={30} color="gray" /></Pressable>
                </View>
                <View>
                  {replyChat.chat.contents.map((content, i) => (
                    <View key={i} >
                      {renderMessageContentReply(content)}
                    </View>
                  ))}</View>
              </View>
            </View>
          )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          padding: 10,
          backgroundColor: "white",
        }}
      >
        <Pressable onPress={() => console.log("Pressed smiley")}>
          <Ionicons name="happy-outline" size={30} color="black" />
        </Pressable>

        <View style={{ width: '54%' }}>
          <TextInput
            value={textMessage}
            onChangeText={setTextMessage}
            style={{
              flex: 1,
              height: 40,
              borderColor: "gray",
              borderRadius: 5,
              fontSize: 17
            }}
            placeholder="Tin nhắn"
            placeholderTextColor="gray"
          />
        </View>

        <View style={{ flexDirection: 'row', width: '35%', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={pickFile}>
            <Ionicons
              name="ellipsis-horizontal-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => console.log("Pressed microphone")}>
            <Ionicons
              name="mic-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={openImagePicker}>
            <Ionicons name="image-outline" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSendMessage}>
            {isLoadMess ? (
              <ActivityIndicator color="black" size="large" />
            ) : (
              <Ionicons name="paper-plane" size={30} color={isColorSend} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* modal lựa chọn */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Choose
            </Text>
            <View style={styles.modalButtonContainer1}>
              <Pressable style={styles.pressCol} onPress={handleGetModalFriend}>
                <FontAwesome5
                  name="share"
                  size={20}
                  color="black"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButton}>Chuyển tiếp</Text>
              </Pressable>
              <Pressable style={styles.pressCol} onPress={handleDeleteMessByStatus}>
                {isLoadXoa ? (
                  <ActivityIndicator color="black" size="large" />
                ) : (
                  <FontAwesome5
                    name="trash"
                    size={20}
                    color="black"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={styles.modalButton} >Xóa</Text>
              </Pressable>
              {
                messageSelected?.sender?.profile?.name === authUser.profile.name
                  ? (
                    <Pressable style={styles.pressCol} onPress={handleDeleteMess}>
                      {isLoadThuHoi ? (
                        <ActivityIndicator color="black" size="large" />
                      ) : (
                        <FontAwesome5
                          name="comment-slash"
                          size={20}
                          color="black"
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <Text style={styles.modalButton}>Thu hồi</Text>
                    </Pressable>

                  ) : (
                    <Text></Text>
                  )}
            </View>
            <View style={styles.modalButtonContainer1}>
              <Pressable style={styles.pressCol} >
                <FontAwesome5
                  name="list"
                  size={20}
                  color="black"
                  style={{ margin: 'auto' }}
                />
                <Text style={styles.modalButton}>Chọn nhiều</Text>
              </Pressable>
              <Pressable style={styles.pressCol} onPress={handleReplyChat}>
                <FontAwesome5
                  name="reply"
                  size={20}
                  color="black"
                  style={{ margin: 'auto' }}
                />
                <Text style={styles.modalButton}>Trả lời</Text>
              </Pressable>
              {
                messageSelected?.chat?.contents[0].type === 'image'
                && (
                  <Pressable style={styles.pressCol} onPress={handleXemAnh}>
                    <FontAwesome5
                      name="image"
                      size={25}
                      color="black"
                      style={{ margin: 'auto' }}
                    />
                    <Text style={styles.modalButton}>Xem ảnh</Text>
                  </Pressable>
                )}
              {
                messageSelected?.chat?.contents[0].type === 'video'
                && (
                  <Pressable style={styles.pressCol} onPress={handleXemAnh}>
                    <FontAwesome5
                      name="video"
                      size={25}
                      color="black"
                      style={{ margin: 'auto' }}
                    />
                    <Text style={styles.modalButton}>Xem video</Text>
                  </Pressable>
                )}
              {
                messageSelected?.chat?.contents[0].type === 'file'
                && (
                  <Pressable style={styles.pressCol} onPress={handleXemFile}>
                    <FontAwesome5
                      name="list"
                      size={25}
                      color="black"
                      style={{ margin: 'auto' }}
                    />
                    <Text style={styles.modalButton}>Xem file</Text>
                  </Pressable>
                )}
            </View>

            <View style={styles.modalButtonContainer}>
              <Pressable onPress={toggleModal}>
                <Text style={styles.modalButton}>HỦY</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>
      {/* modal load danh sách bạn bè để chuyển tiếp */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalFriendVisible}
        onRequestClose={toggleModalFriend}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Choose
            </Text>
            <View style={styles.modalButtonContainer}>
              <ScrollView>
                <View style={styles.friendList}>
                  <View style={styles.friendListHeader}>
                    <Text style={styles.sectionTitle}></Text>
                    {isLoadChuyenTiep ? (
                      <ActivityIndicator color="black" size="large" />
                    ) : (
                      <View></View>
                    )}
                    <Pressable onPress={(toggleModalFriend)}><Ionicons name="close" size={30} color="black" /></Pressable>
                  </View>
                  {friends.map((friend, index) => (
                    <View key={index} style={styles.friendRow}>
                      <Pressable style={styles.friendItem} >
                        <View style={styles.friendInfo}>
                          <Image
                            source={{
                              uri: friend.avatar
                            }}
                            style={styles.friendAvatar}
                          />
                          <Text style={styles.friendName}>{friend.name}</Text>
                        </View>
                        <View style={styles.friendActions}>
                          <Pressable onPress={() => chuyenTiepChat(friend)} style={styles.pressCol}>
                            <FontAwesome5
                              name="arrow-right"
                              size={30}
                              color="black"
                              style={{ alignContent: "center", alignItems: "center" }}
                            />
                          </Pressable>
                        </View>
                      </Pressable>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.modalButtonContainer}>
              <Pressable onPress={toggleModalFriend}>
                <Text style={styles.modalButton}>HỦY</Text>
              </Pressable>
              <Pressable >
                <Text style={styles.modalButton}>XÁC NHẬN</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* modalImage */}
      <Modal
        visible={modalImage}
        transparent={true}
        onRequestClose={() => setModalImage(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={{ paddingLeft: '80%' }} onPress={() => {
            setModalImage(false);
            toggleModal()
          }}>
            <View>
              <FontAwesome5
                name="times"
                size={30}
                color="black"
                style={{ alignContent: "center", alignItems: "center" }}
              />
            </View>
          </TouchableOpacity>
          {messageSelected?.chat?.contents[0].type === 'image' ? (<Image
            source={{ uri: messageSelected?.chat?.contents[0].data }}
            style={{ width: '90%', height: null, aspectRatio: 1, borderRadius: 10 }}
            resizeMode="contain"
          />) : (<Video
            source={{ uri: messageSelected?.chat?.contents[0].data }}
            useNativeControls
            resizeMode="contain"
            style={{ width: '90%', height: null, aspectRatio: 1, borderRadius: 10 }}
          />)
          }
        </View>
      </Modal>
    </View >
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e2e8f1",
  },
  modalImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%'
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
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
    marginTop: 20
  },
  modalButton: {
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#0091FF",
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
  pressCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonContainer1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginTop: 20
  },
  styleSender: {
    marginTop: 10,
    justifyContent: 'space-around',
    borderRadius: 10,
    backgroundColor: "#cff0fe",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    paddingTop: 5,
    marginLeft: 30,
    marginRight: 10
  },
  styleRecive: {
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    justifyContent: 'space-around',
    borderRadius: 10,
    paddingTop: 5,
    marginRight: 50
  },

});
export default Message;