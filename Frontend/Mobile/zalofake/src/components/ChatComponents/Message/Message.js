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
import { useAuthContext } from "../../../contexts/AuthContext";
import * as DocumentPicker from 'expo-document-picker';
import useConversation from "../../../hooks/useConversation";
import { useSelector, useDispatch } from "react-redux";
import { selectIsUpdateConversation, setIsUpdateConversation } from "../../../redux/stateUpdateConversationSlice";
import useToast from "../../../hooks/useToast";
import useFriend from "../../../hooks/useFriend";
import { selectFriends } from "../../../redux/stateFriendsSlice";
import useGroup from "../../../hooks/useGroup";

const Message = ({ navigation, route }) => {
  // State loading
  const messageStatus = { SENDING: 'SENDING', DELETING: 'DELETING', RECALLING: 'RECALLING' }
  const [isLoadingStatus, setIsLoadingStatus] = useState([])
  const [isLoadForward, setIsLoadForward] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalFriendVisible, setIsModalFriendVisible] = useState(false);
  const [modalImage, setModalImage] = useState(false);

  // Call api
  const { showToastSuccess, showToastError } = useToast();
  const { getFriendById } = useFriend();
  const { getConversationByID } = useConversation();
  const { authUser } = useAuthContext()
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  const { renderMessageContent, renderMessageContentReply, handleGetTimeInMessage, addMessage, sendMessage } = useMessage();
  const friends = useSelector(selectFriends);
  const { groups, getGroups } = useGroup();

  // Redux:
  const dispatch = useDispatch();
  const isUpdateConversation = useSelector(selectIsUpdateConversation)

  const { chatItem } = route.params;
  const [conversation, setConversation] = useState([])
  const [textMessage, setTextMessage] = useState('')
  const [chats, setChats] = useState([]);
  const scrollViewRef = useRef();
  const [messageSelected, setMessageSelected] = useState(null);
  const [replyChat, setReplyChat] = useState(null);
  const [userToForward, setUserToForward] = useState([]);

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
            onPress={() => navigation.navigate("MessageSettings", { conversation: chatItem })}
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
          <View style={{ width: '30%' }}>
            <Image
              source={{ uri: chatItem.avatar }}
              style={{ width: 45, height: 40, borderRadius: 25 }}
            />
          </View>
          <Text style={{ fontSize: 19, color: "white", fontWeight: 'bold' }}>{chatItem.chatName}</Text>
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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleModalFriend = () => {
    setIsModalFriendVisible(!isModalFriendVisible);
  };

  const fetchConversation = async () => {
    const response = await getConversationByID(chatItem?.conversation._id)
    setConversation(response)
  }
  useEffect(() => {
    fetchConversation()
  }, [isUpdateConversation])

  useEffect(() => {
    if (conversation && conversation.messages) {
      fetchChats();
    }
  }, [conversation]);

  const fetchChats = async () => {
    try {
      const chatNew = await Promise.all(conversation.messages.map(async (message) => {
        let nameReply = null
        if (message.replyMessageId) {
          nameReply = conversation.participants.find((participant) => participant._id === message.replyMessageId.senderId) || await getFriendById(message.replyMessageId.senderId)
        }
        return {
          chat: message,
          sender: conversation.participants.find((participant) => participant._id === message.senderId) || await getFriendById(message.senderId),
          nameReply: nameReply?.profile?.name
        }
      }))
      setChats(chatNew);
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToEnd = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }
  const setChat = async (dataChat) => {
    let nameReply = null
    if (dataChat.replyMessageId) {
      nameReply = conversation.participants.find((participant) => participant._id === dataChat.replyMessageId.senderId) || await getFriendById(dataChat.replyMessageId.senderId)
    }
    setChats(prevChats => [
      ...prevChats,
      {
        chat: dataChat,
        sender: conversation.participants.find(sender => sender._id === dataChat.senderId),
        nameReply: nameReply?.profile?.name
      }
    ]);
  }

  useEffect(() => {
    const fetchSocket = async () => {
      if (isNewSocket === "new_message") {
        const message = newSocketData;
        // console.log("new_message", message);
        if (message && message.retrunMessage) {
          if (
            message.conversationId === conversation._id &&
            message.retrunMessage.receiverId === chatItem._id && message.retrunMessage.senderId !== authUser._id
          ) {
            setChat(message.retrunMessage)
            scrollToEnd()
          }
        }
      }
      if (isNewSocket === "delete_message") {
        const { conversationId, isDeleted } = newSocketData;
        if (conversation && conversation._id === conversationId) {
          if (isDeleted) {
            setChats([]);
          } else {
            fetchConversation();
            console.log("socket delete message");
          }
        }
      }
      if (isNewSocket === "remove-from-group") {
        // console.log("newSocketData",newSocketData);
        const group = newSocketData
        if (group && group.removeMembers) {
          if (group.removeMembers.includes(authUser._id)) {
            navigation.navigate("ChatComponent");
            // setNewSocketData(null)
          }
        }
      }
      if (isNewSocket === "delete-group") {
        // console.log("delete-group in message", newSocketData);
        const group = newSocketData
        if (group && group.id === conversation._id) {
          navigation.navigate("ChatComponent");
          // setNewSocketData(null)
        }
      }
      if (isNewSocket === "update-group") {
        const group = newSocketData
        if (group && group.id === conversation._id) {
          // console.log("update-group",group);
          setConver(preConver => ({
            ...preConver,
            name: group.name,
            avatar: group.avatar
          }))
          dispatch(setIsUpdateConversation())
        }
      }

    }
    fetchSocket()
  }, [isNewSocket, newSocketData]);

  const handlePressIn = (message) => {
    setMessageSelected(message)
    setModalVisible(true)
  };

  const handleMessRecall = () => {
    setIsLoadingStatus(messageStatus.RECALLING)
    handleDeleteOrRecall(`/chats/${messageSelected.chat._id}/delete`, "Thu hồi thành công")
  };
  const handleMessDelete = () => {
    setIsLoadingStatus(messageStatus.DELETING)
    handleDeleteOrRecall(`conversations/deleteOnMySelf/${conversation._id}/${messageSelected.chat._id}`, "Xóa thành công")
  };

  const handleDeleteOrRecall = async (api, toast) => {
    try {
      const response = await axiosInstance.post(api)
      if (response.status === 200) {
        fetchConversation()
        showToastSuccess(toast)
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoadingStatus([])
    toggleModal()
  }
  const handleGetModalFriend = () => {
    toggleModal();
    toggleModalFriend();
  };

  const handleMessForward = async (user) => {
    setIsLoadForward((prevStatus) => [...prevStatus, { id: user._id, status: messageStatus.FORWARDING }])
    const send = await sendMessage(user._id, addMessage(messageSelected.chat.contents[0], user.tag, replyChat, true), 'sendText')
    if (send) {
      showToastSuccess("Chuyển tiếp thành công")
    } else {
      showToastError("Chuyển tiếp thất bại")
    }
    setIsLoadForward((prevStatus) => prevStatus.filter(item => item.id !== user._id))
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
  const setChatItem = async (dataChat) => {
    let nameReply = null
    let senderName = authUser
    if (dataChat.replyMessageId) {
      nameReply = conversation.participants.find((participant) => participant._id === dataChat.replyMessageId.senderId)
      if (!nameReply) {
        nameReply = await getFriendById(dataChat.replyMessageId.senderId)
      }
    }
    if (dataChat.senderId !== authUser._id) {
      senderName = conversation.participants.find(sender => sender._id === dataChat.senderId)
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
    setIsLoadingStatus(messageStatus.SENDING)
    const response = await sendMessage(user, formData, typeSend)
    if (response && response.status === 201) {
      console.log(`${typeSend} success`);
      setChatItem(response.data.data.message)
      setReplyChat(null);
      dispatch(setIsUpdateConversation())
      scrollToEnd();
    } else {
      console.log(`${typeSend} fail`);
    }
    setIsLoadingStatus([])
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
      appendIs(formData, chatItem.tag)
      send(chatItem._id, formData, typeSend)
    }
    if (isVideo) {
      appendIs(formDataVideo, chatItem.tag)
      send(chatItem._id, formDataVideo, 'sendVideo')
    }
  }

  const handleSendMessage = async () => {
    if (textMessage !== '') {
      send(chatItem._id, addMessage(textMessage, chatItem.tag, replyChat), 'sendText')
      setTextMessage('');
    }
  }
  const checkAuthUser = (message) => {
    if (authUser._id === message.sender._id) {
      return true;
    } else {
      return false;
    }
  };

  const handleShowScreen = (message) => {
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

  const handleXemFile = async () => {
    const url = messageSelected.chat.contents[0].data;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error("Don't know how to open URI: " + url);
    }
  };

  useEffect(() => {
    getGroups()
    const fetchUserToForward = friends.map((friend) => {
      return {
        _id: friend.userId,
        name: friend.profile.name,
        avatar: friend.profile.avatar.url,
        tag: 'friend'
      }
    })
    const fetchGroup = groups.map((group) => {
      return {
        _id: group._id,
        name: group.groupName,
        avatar: group.avatar.url,
        tag: group.conversation.tag
      }
    })
    fetchUserToForward.push(...fetchGroup)
    setUserToForward(fetchUserToForward);
  }, [friends])

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E9EB" }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ScrollView ref={scrollViewRef}>
          <View style={{ flex: 1 }}>
            {chats.length > 0 ?
              (chats.map((message, index) => (
                <View key={index}>
                  {
                    handleShowScreen(message) && (
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: checkAuthUser(message) ? "flex-end" : "flex-start" }} >
                        {!checkAuthUser(message) &&
                          (<View
                            style={{ width: 35, height: 35, justifyContent: "center", alignItems: "center", marginLeft: 10, marginRight: 10 }} >
                            <Image
                              source={{ uri: message.sender.profile.avatar.url }}
                              style={{ width: 35, height: 35, borderRadius: 25 }}
                            />
                          </View>)}
                        <View style={[
                          checkAuthUser(message) ? styles.styleSender : styles.styleRecive
                        ]}>
                          <Text style={{ paddingHorizontal: 10, fontSize: 12, color: 'gray', fontWeight: '700' }}>
                            {message.sender._id === authUser._id ? 'Bạn' : message.sender.profile.name}
                          </Text>
                          {message.chat.replyMessageId &&
                            (<View style={{ backgroundColor: '#89D5FB', display: 'flex', marginLeft: 10, borderLeftWidth: 2, borderColor: '#0072AB', marginRight: 10 }}>

                              {message.chat.replyMessageId.contents.map((content) => (
                                <View key={content._id} style={{ display: 'flex', paddingVertical: 10, alignItems: 'center', }}>
                                  {content.type === 'text' ? (
                                    <View>
                                      <Text style={{ fontSize: 13, fontWeight: 'bold', paddingLeft: 15 }}>
                                        {message.nameReply}
                                      </Text>
                                      {renderMessageContentReply(content)}
                                    </View>
                                  ) : (
                                    <View style={{ display: 'flex', paddingVertical: 5, alignItems: 'center', paddingRight: 5, flexDirection: 'row' }}>
                                      {renderMessageContentReply(content)}
                                      <View>
                                        <Text style={{ paddingLeft: 10, fontSize: 13, fontWeight: 'bold' }}>
                                          {message.nameReply}
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
                          {message.chat.contents.map((content) => (
                            <Pressable key={content._id}
                              onPress={() => handlePressIn(message)}>
                              <View>
                                {renderMessageContent(content)}
                                <View style={{ paddingLeft: 15, paddingRight: 15, paddingBottom: 5 }}><Text style={{ fontSize: 14 }}>{handleGetTimeInMessage(message.chat.timestamp)}</Text></View>
                              </View>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}
                </View>
              ))) : (<View><Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', paddingVertical: 10 }}>Chưa có tin nhắn nào!</Text></View>)}

          </View>
        </ScrollView>
      </View >
      <View>
        {replyChat &&
          (
            <View style={{ backgroundColor: 'white', padding: 10 }}>
              <View style={{ borderLeftWidth: 2, marginLeft: 10 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ paddingLeft: 15, fontSize: 14, color: '#000' }}>
                    Trả lời: <Text style={{ paddingLeft: 15, fontSize: 14, color: 'gray', fontWeight: 'bold' }}>
                      {replyChat.sender._id === authUser._id ? 'Bạn' : replyChat.sender.profile.name}
                    </Text>
                  </Text>
                  <Pressable onPress={() => { setReplyChat(null) }} style={{ marginRight: 20 }}><Ionicons name="close" size={30} color="gray" /></Pressable>
                </View>
                <View>
                  {replyChat.chat.contents.map((content) => (
                    <View key={content._id} >
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
            onChangeText={(textMessage) => setTextMessage(textMessage)}
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
            {isLoadingStatus === messageStatus.SENDING ? (
              <ActivityIndicator color="black" size="large" />
            ) : (
              <Ionicons name="paper-plane" size={30} color={textMessage ? '#0091FF' : 'black'} />
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
        <Pressable style={styles.modalContainer} onPress={toggleModal}>
          <View style={styles.modalContent}>
            <View style={styles.modalButtonContainer1}>
              <Pressable style={styles.pressCol} onPress={handleGetModalFriend}>
                <FontAwesome5
                  name="share"
                  size={20}
                  color="#3498DB"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalButton}>Chuyển tiếp</Text>
              </Pressable>
              <Pressable style={styles.pressCol} onPress={handleMessDelete}>
                {isLoadingStatus === messageStatus.DELETING ? (
                  <ActivityIndicator color="black" size="large" />
                ) : (
                  <FontAwesome5
                    name="trash"
                    size={20}
                    color="#E63946"
                    style={{ marginRight: 8 }}
                  />
                )}
                <Text style={styles.modalButton} >Xóa</Text>
              </Pressable>
              <Pressable style={styles.pressCol} onPress={() => {
                setReplyChat(messageSelected);
                toggleModal();
              }}>
                <FontAwesome5
                  name="reply"
                  size={20}
                  color="#7F00FF"
                  style={{ margin: 'auto' }}
                />
                <Text style={styles.modalButton}>Trả lời</Text>
              </Pressable>
            </View>
            <View style={styles.modalButtonContainer1}>
              <Pressable style={styles.pressCol} >
                <FontAwesome5
                  name="list"
                  size={20}
                  color="#A8DADC"
                  style={{ margin: 'auto' }}
                />
                <Text style={styles.modalButton}>Chọn nhiều</Text>
              </Pressable>
              {
                messageSelected?.sender?._id === authUser._id
                && (
                  <Pressable style={styles.pressCol} onPress={handleMessRecall}>
                    {isLoadingStatus === messageStatus.RECALLING ? (
                      <ActivityIndicator color="black" size="large" />
                    ) : (
                      <FontAwesome5
                        name="comment-slash"
                        size={20}
                        color="#FF4500"
                        style={{ marginRight: 8 }}
                      />
                    )}
                    <Text style={styles.modalButton}>Thu hồi</Text>
                  </Pressable>

                )}
            </View>
            <View style={styles.modalButtonContainer1}>
              {
                messageSelected?.chat?.contents[0].type === 'image'
                && (
                  <Pressable style={styles.pressCol} onPress={() => { setModalImage(true); toggleModal() }}>
                    <Ionicons
                      name="images"
                      size={25}
                      color="#DB7093"
                      style={{ margin: 'auto' }}
                    />
                    <Text style={styles.modalButton}>Xem ảnh</Text>
                  </Pressable>
                )}
              {
                messageSelected?.chat?.contents[0].type === 'video'
                && (
                  <Pressable style={styles.pressCol} onPress={() => { setModalImage(true); toggleModal() }}>
                    <Ionicons
                      name="videocam"
                      size={28}
                      color="#4169E1"
                      style={{ margin: 'auto' }}
                    />
                    <Text style={styles.modalButton}>Xem video</Text>
                  </Pressable>
                )}
              {
                messageSelected?.chat?.contents[0].type === 'file'
                && (
                  <Pressable style={styles.pressCol} onPress={handleXemFile}>
                    <Ionicons
                      name="document-text"
                      size={26}
                      color="#90EE90"
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
        </Pressable>
      </Modal>
      {/* modal load danh sách bạn bè để chuyển tiếp */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalFriendVisible}
        onRequestClose={toggleModalFriend}
      >
        <Pressable style={styles.modalContainer} onPress={toggleModalFriend}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={styles.friendList}>
                <View style={styles.friendListHeader}>
                  <Text style={styles.sectionTitle}></Text>
                  <Pressable onPress={(toggleModalFriend)}><Ionicons name="close" size={30} color="black" /></Pressable>
                </View>
                {userToForward.map((user) => (
                  <View key={user._id} style={styles.friendRow}>
                    <Pressable style={styles.friendItem} >
                      <View style={styles.friendInfo}>
                        <Image
                          source={{ uri: user.avatar }}
                          style={styles.friendAvatar}
                        />
                        <Text style={styles.friendName}>{user.name}</Text>
                      </View>
                      <View style={styles.friendActions}>
                        <Pressable onPress={() => handleMessForward(user)} style={styles.pressCol}>
                          {isLoadForward.some((item) => item.id === user._id && item.status === messageStatus.FORWARDING)
                            ? <ActivityIndicator color="black" size="large" />
                            : <Ionicons
                              name="arrow-forward-circle"
                              size={28}
                              color="#5472E0"
                              style={{ alignContent: "center", alignItems: "center" }}
                            />
                          }
                        </Pressable>
                      </View>
                    </Pressable>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <Pressable onPress={toggleModalFriend}>
                <Text style={styles.modalButton}>HỦY</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* modalImage */}
      <Modal
        animationType="slide"
        visible={modalImage}
        transparent={true}
        onRequestClose={() => setModalImage(false)}
      >
        <Pressable style={{ backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'center', alignItems: 'center', height: '100%' }}
          onPress={() => setModalImage(false)}>
          <View style={{ width: '80%', height: '80%', backgroundColor: 'white', borderRadius: 10 }}>
            <Pressable style={{ width: '100%', alignItems: 'flex-end', justifyContent: 'flex-end' }}
              onPress={() => setModalImage(false)}>
              <Ionicons
                name="close"
                size={30}
                color="black"
              />
            </Pressable>
            {messageSelected?.chat?.contents[0].type === 'image'
              ? (<Image
                source={{ uri: messageSelected?.chat?.contents[0].data }}
                style={{ width: '100%', height: '90%', borderRadius: 10 }}
                resizeMode="contain"
              />)
              : (<Video
                source={{ uri: messageSelected?.chat?.contents[0].data }}
                useNativeControls
                resizeMode="contain"
                style={{ width: '100%', height: '90%', borderRadius: 10 }}
              />)
            }
          </View>
        </Pressable>
      </Modal>
    </View >
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    color: "gray",
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
    justifyContent: "space-evenly",
    alignItems: 'center',
    marginTop: 20,
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