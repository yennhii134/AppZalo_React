import { useState } from "react";

import axiosInstance from "../api/axiosInstance";
import Toast from "react-native-toast-message";

const useConversation = () => {
  const [conversations, setConversations] = useState([]);
  const [conversation, setConversation] = useState({});

  const getConversations = async () => {
    try {
      const response = await axiosInstance.get(
        "/conversations/getConversations"
      );
      if (response.status === 200) {
        setConversations(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getConversationsByParticipants = async (participant) => {
    try {
      const participants = []
      participants.push(participant)
      const response = await axiosInstance.post(
        "/conversations/getByParticipants", { participants }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      return null;
    }
  };
  const deleteConversation = async (conversationId) => {
    try {
      const response = await axiosInstance.post(
        `conversations/deleted/${conversationId}`
      );
      if (response.status === 200) {
        Toast.success("Conversation deleted successfully");
        getConversations();
      }
    } catch (error) {
      console.log(error);
      Toast.error("Failed to delete conversation");
    }
  };

  const getConversationByID = async (conversationId) => {
    try {
      const response = await axiosInstance.get(
        `conversations/get/${conversationId}`
      );
      if (response.status === 200) {
        setConversation(response.data);
        return response.data;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const handleMessageNavigation = async (itemChat) => {
    if (itemChat?.conversation?.tag === 'group') {
      return {
        _id: itemChat._id,
        conversation: itemChat.conversation,
        chatName: itemChat.groupName,
        avatar: itemChat.avatar.url,
        tag: itemChat.conversation.tag
      }
    } else {
      return {
        _id: itemChat.userId,
        conversation: await getConversationsByParticipants(itemChat.userId) || null,
        chatName: itemChat.profile.name,
        avatar: itemChat.profile.avatar.url,
        tag: "friend"
      }
    }
  };

  return {
    conversations,
    conversation,
    getConversations,
    deleteConversation,
    getConversationByID,
    getConversationsByParticipants,
    handleMessageNavigation,
  };
};

export default useConversation;
