import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuthContext } from "./AuthContext";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../api/config";

const SocketContext = createContext();
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const { refreshToken, authUser, setAuthUser, reloadAuthUser } =
    useAuthContext();

  const [isNewSocket, setIsNewSocket] = useState(null);
  const [newSocketData, setNewSocketData] = useState(null);

  const connectSocket = (token) => {
    const newSocket = io(config.socketURL, {
      query: {
        token: token,
      },
    });
    setSocket(newSocket);
  };

  useEffect(() => {
    if (refreshToken) {
      connectSocket(refreshToken);
    } else {
      setSocket(null);
      socket?.disconnect();
    }
    return () => {
      if (socket) {
        socket?.disconnect();
      }
    };
  }, [refreshToken]);

  useEffect(() => {
    if (socket) {
      socket.on("force_logout", () => {
        if (authUser) {
          Toast.error("Your account has been logged out from another device");
        }
        socket.disconnect();
        setAuthUser(null);
        AsyncStorage.clear();
      });
      socket.on("online_friends", (onlineFriends) => {
        setOnlineFriends(onlineFriends);
      });
      socket.on("receive-request-add-friend", handleReceiveFriendRequest);
      socket.on("accept-request-add-friend", handleFriendAcceptAction);
      socket.on("reject-request-add-friend", handleFriendRejectAction);
      socket.on("cancel-request-add-friend", handleFriendAction);
      socket.on("unfriend", handleFriendAction);
      // socket for chat
      socket.on("new_message", handleNewMessage);
      socket.on("delete_message", handleDeleteMessage);
      // socket for group
      socket.on("add-to-group", handleAddToGroup);
      socket.on("update-group", handleUpdateGroup);
      socket.on("remove-from-group", handleRemoveFromGroup);
      socket.on("leave-group", handleLeaveGroup);
      socket.on("delete-group", handleDeleteGroup);
      socket.on("change-admins", handleChangeAdminGroup);
      socket.on("update-group", handleUpdateGroup);
      socket.on("member-to-admin", handleMakeAdmin);

      return () => {
        socket.off("force_logout");
        // socket for friend
        socket.off("receive-request-add-friend", handleReceiveFriendRequest);
        socket.off("accept-request-add-friend", handleFriendAcceptAction);
        socket.off("reject-request-add-friend", handleFriendRejectAction);
        socket.off("cancel-request-add-friend", handleFriendAction);
        socket.off("unfriend", handleFriendAction);
        // socket for chat
        socket.off("new_message", handleNewMessage);
        socket.off("delete_message", handleDeleteMessage);
        // socket for group
        socket.off("add-to-group", handleAddToGroup);
        socket.off("update-group", handleUpdateGroup);
        socket.off("remove-from-group", handleRemoveFromGroup);
        socket.off("leave-group", handleLeaveGroup);
        socket.off("delete-group", handleDeleteGroup);
        socket.off("change-admins", handleChangeAdminGroup);
        socket.off("update-group", handleUpdateGroup);
        socket.off("member-to-admin", handleMakeAdmin);
      };
    }
  }, [socket, authUser]);

  const handleReceiveFriendRequest = async (sender) => {
    Toast.show({
      text1: `${sender.sender.name} đã gửi một yêu cầu kết bạn`,
      type: "success",
    });
    await reloadAuthUser();
  };

  const handleFriendAcceptAction = async (sender) => {
    Toast.show({
      text1: `${sender.sender.name} đã chấp nhận yêu cầu kết bạn`,
      type: "success",
    });
    await reloadAuthUser();
  };
  const handleFriendRejectAction = async (sender) => {
    console.log("reject", sender);
    Toast.show({
      text1: `${sender.sender.name} đã từ chối yêu cầu kết bạn`,
      type: "error",
    });
    await reloadAuthUser();
  };

  const handleFriendAction = async () => {
    await reloadAuthUser();
  };

  // handle for chat
  const handleNewMessage = ({ message }) => {
    setIsNewSocket("new_message");
    setNewSocketData(message);
  };

  const handleDeleteMessage = ({ chatRemove, conversationId, isDeleted }) => {
    setIsNewSocket("delete_message");
    setNewSocketData({ chatRemove, conversationId, isDeleted });
  };

  // handle for group
  const handleAddToGroup = ({ data }) => {
    setIsNewSocket("add-to-group");
    setNewSocketData(data);
  };
  const handleUpdateGroup = ({ group }) => {
    setIsNewSocket("update-group");
    setNewSocketData(group);
  }
  const handleRemoveFromGroup = ({ group }) => {
    setIsNewSocket("remove-from-group");
    setNewSocketData(group);
    setIsNewSocket(null);
  };

  const handleLeaveGroup = ({ group }) => {
    setIsNewSocket("leave-group");
    setNewSocketData(group);
  };
  const handleDeleteGroup = ({ group }) => {
    setIsNewSocket("delete-group");
    setNewSocketData(group);
  }
  const handleChangeAdminGroup = ({ group, members, typeChange }) => {
    setIsNewSocket("change-admins");
    setNewSocketData({ group, members, typeChange });
  }
  const handleMakeAdmin = ({ group }) => {
    setIsNewSocket("member-to-admin");
    setNewSocketData({ group });
  }
  return (
    <SocketContext.Provider
      value={{ socket, onlineFriends, isNewSocket, newSocketData, setNewSocketData }}>
      {children}
    </SocketContext.Provider>
  );
};
