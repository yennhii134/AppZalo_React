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
        const newConversationList = response.data.map((conversation) => {
          return {
            _id: conversation._id,
            participants: conversation.participants,
            messages: conversation.messages,
            lastMessage: conversation.lastMessage,
            tag: conversation.tag,
          };
        });
        setConversations(newConversationList);
      }
    } catch (error) {
      console.log(error);
      // toast.error("Failed to get conversations");
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
  const handleFriendMessage = async (friend) => {
    let conversation;

    conversation = await getConversationsByParticipants(friend.userId);
    if (conversation === null) {
      const conversationNew = {
        _id: friend.userId,
        conversation: null,
        name: friend?.profile.name,
        avatar: friend?.profile.avatar?.url,
        background: friend?.profile.background?.url,
        tag: 'friend',
      };
      return conversationNew;
    }
    else {
      const conversationNew = {
        _id: friend.userId,
        conversation: conversation,
        name: friend?.profile.name,
        avatar: friend?.profile.avatar?.url,
        background: friend?.profile.background?.url,
        lastMessage: conversation.lastMessage,
        tag: conversation.tag,
      };
      return conversationNew;
    }
  };

  return {
    conversations,
    conversation,
    getConversations,
    deleteConversation,
    getConversationByID,
    getConversationsByParticipants,
    handleFriendMessage
  };
};

export default useConversation;
