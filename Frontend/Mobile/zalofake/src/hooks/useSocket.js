import { useState } from "react";
import useMessage from "./useMessage";

const useSocket = () => {
    const { setDataChat, handleGetTimeInChat, sortTime } = useMessage();

    const handleUpdateChats = async (chats, conversationId, retrunMessage, isDelete) => {
        // console.log("chats",chats,"conversationId",conversationId,"retrunMessage",retrunMessage,"isDelete",isDelete);
        const updateChat = await Promise.all(chats.map(async (chat) => {
            if (chat.conversation._id === conversationId) {
                const friend = chat.conversation.participants.find((participant) => participant._id === retrunMessage.senderId)
                const chatData = setDataChat(retrunMessage, friend, isDelete);
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
    const fetchSocket = async (isNewSocket, newSocketData, chats) => {
        if (isNewSocket === "new_message") {
            const message = newSocketData;
            if (message && message.retrunMessage) {
                const update = await handleUpdateChats(chats, message.conversationId, message.retrunMessage, false)
                const sortUpdate = sortTime(update);
                return sortUpdate;
                // setNewSocketData(null);
            }
        }
        if (isNewSocket === "delete_message") {
            const { chatRemove, conversationId, isDeleted } = newSocketData;
            console.log("chatRemove", chatRemove);
            if (chatRemove) {
                if (isDeleted) {
                    // const updatedListFriends = chats.map((chat) => {
                    //     if (chat.conversation._id === conversationId) {

                    //     }
                    // });
                } else {
                    const update = await handleUpdateChats(chats, conversationId, chatRemove, true)
                    return update;
                }
            }
        }
    }
    return { fetchSocket }
}
export default useSocket;