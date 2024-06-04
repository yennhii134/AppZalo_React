import React from 'react';
import { View, Text, Image } from 'react-native';
import { Video } from 'expo-av';
import Toast from "react-native-toast-message";
import moment from 'moment-timezone';
import axiosInstance from '../api/axiosInstance';
import useGroup from './useGroup';
import { useAuthContext } from '../contexts/AuthContext';

const useMessage = () => {
  const { getUserById } = useGroup()
  const { authUser } = useAuthContext();

  const showToastSuccess = (notice) => {
    Toast.show({
      text1: notice,
      type: "success",
      topOffset: 0,
      position: "bottom",
    });
  };
  const showToastError = (notice) => {
    Toast.show({
      text1: notice,
      type: "error",
      topOffset: 0,
      position: "bottom",
    });
  };
  const renderMessageContent = (content) => {
    if (content.type === 'text') {
      return (
        <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 5 }}>
          <Text style={{ fontSize: 18 }}>{content.data}</Text>
        </View>
      );
    } else if (content.type === 'image') {
      return (
        <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 5 }}>
          <Image
            source={{ uri: content.data }}
            style={{ width: 150, height: 150, borderRadius: 10 }}
          />
        </View>
      );
    } else if (content.type === 'video') {
      return (
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <Video
            source={{ uri: content.data }}

            useNativeControls
            resizeMode="contain"

            style={{ width: 200, height: 200, borderRadius: 10 }}

          />
        </View>
      );
    } else if (content.type === 'file') {
      return (

        <View style={{ paddingLeft: 15, paddingRight: 15 }}>

          <Text style={{ fontSize: 14 }}>{content.data}</Text>

        </View>

      );
    } else {
      return null; // Loại nội dung không được hỗ trợ
    }
  }
  const renderMessageContentReply = (content) => {
    if (content.type === 'text') {
      return (
        <View style={{ paddingHorizontal: 15 }}>
          <Text style={{ fontSize: 14 }}>{content.data}</Text>
        </View>
      );
    } else if (content.type === 'image') {
      return (
        <View style={{ paddingLeft: 10 }}>
          <Image
            source={{ uri: content.data }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />
        </View>
      );
    } else if (content.type === 'video') {
      return (
        <View style={{ paddingLeft: 10 }}>
          <Video
            source={{ uri: content.data }}

            useNativeControls
            resizeMode="contain"

            style={{ width: 120, height: 120, borderRadius: 10 }}

          />
        </View>
      );
    }
    else if (content.type === 'file') {
      return (
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <Text style={{ fontSize: 14 }}>{content.data}</Text>
        </View>

      );
    }
    else {
      return null; // Loại nội dung không được hỗ trợ
    }
  }
  const handleGetTimeInChat = (time) => {
    const currentTime = moment().tz('Asia/Ho_Chi_Minh'); // Lấy thời gian hiện tại ở múi giờ Việt Nam
    const vietnamDatetime = moment(time).tz('Asia/Ho_Chi_Minh'); // Chuyển đổi thời gian đã cho sang múi giờ Việt Nam
    const timeDifference = moment.duration(currentTime.diff(vietnamDatetime)); // Tính khoảng cách thời gian

    const days = Math.floor(timeDifference.asDays()); // Số ngày
    const hours = Math.abs(timeDifference.hours()); // Số giờ (dương)
    const minutes = Math.abs(timeDifference.minutes()); // Số phút (dương)
    const seconds = Math.abs(timeDifference.seconds()); // Số giây (dương)

    if (days >= 1) {
      return `${days} ngày`;
    }
    else if (hours >= 1) {
      return `${hours} giờ`;
    }
    else if (minutes >= 1) {
      return `${minutes} phút`;
    }
    else {
      return `${seconds} giây`;
    }
  }
  const handleGetTimeInMessage = (time) => {
    const vietnamDatetime = moment(time).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
    const dateObject = new Date(vietnamDatetime);
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0'); // Sử dụng padStart để đảm bảo số phút có 2 chữ số
    return `${hours}:${minutes}`;
  };
  const addMessage = (textMessage, tag, replyChat) => {
    return {
      data: {
        type: 'text', data: textMessage
      },
      replyMessageId: replyChat !== null ? replyChat.chat._id : null,
      isGroup: tag === "group" ? true : false
    }
  }
  const sendMessage = async (user, message, typeSend) => {
    try {
      let headers = {}
      if (typeSend === 'sendImages' || typeSend === 'sendVideo' || typeSend === 'sendFiles') {
        headers = {
          "Content-Type": "multipart/form-data",
        }
      }
      const response = await axiosInstance.post(`/chats/${user}/${typeSend}`, message, { headers })
      return response;

    } catch (error) {
      console.log("Error send message:", error)
      return false;
    }
  }
  const setDataChat = async (conver, isDelete) => {
    let dataChat = '';
    const getUser = await getUserById(conver.senderId)
    if (authUser.profile.name === getUser.user.profile.name) {
      dataChat = "Bạn"
    } else {
      dataChat = getUser.user.profile.name
    }
    if (isDelete) {
      dataChat = dataChat + ": đã thu hồi tin nhắn";
    }
    else {
      if (conver.contents[0].type === "text") {
        dataChat = dataChat + ': ' + conver.contents[0].data;
      } else if (conver.contents[0].type === "image") {
        dataChat = dataChat + ': [Hình ảnh]';
      } else if (conver.contents[0].type === "video"){
        dataChat = dataChat + ': [Video]';
      } else {
        dataChat = dataChat + ': [File]';
      }
    }
    return dataChat;
  }
  const sortTime = (data) => {
    data.sort((a, b) => {
      const timeA = a?.chat?.lastMessage?.timestamp || a.lastMessage.timestamp 
      const timeB = b?.chat?.lastMessage?.timestamp || b.lastMessage.timestamp 
      return timeB.localeCompare(timeA);
    });
    return data;
  }
  return {
    renderMessageContent,
    showToastError,
    showToastSuccess,
    renderMessageContentReply,
    handleGetTimeInChat,
    handleGetTimeInMessage,
    addMessage,
    sendMessage,
    setDataChat,
    sortTime
  };
};

export default useMessage;
