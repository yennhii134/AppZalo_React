import { useState } from "react";
import Toast from "react-native-toast-message";

import axiosInstance from "../api/axiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const useFriend = () => {
  const [friends, setFriends] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const { reloadAuthUser } = useAuthContext();

  const showErrorToast = (message) => {
    Toast.show({
      type: "error",
      text1: message,
      position: "bottom",
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
    });
  };

  const showSuccessToast = (message) => {
    Toast.show({
      type: "success",
      text1: message,
      position: "bottom",
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
    });
  };

  const getAllFriends = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("users/get/friends");
      if (response.status === 200) {
        const newFriendList = response.data.friends.map((friend) => ({
          id: friend.userId,
          phone: friend.phone,
          name: friend.profile.name,
          avatar: friend.profile.avatar.url ?? "/zalo.svg",
          background: friend.profile.background.url ?? "/zalo.svg",
        }));
        setFriends(newFriendList);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to get friends");
    }
    setLoading(false);
  };

  const getRecommendedFriends = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("users/get/random-not-friends");
      if (response.status === 200) {
        const newFriendList = response.data.users.map((friend) => ({
          id: friend.userId,
          phone: friend.phone,
          name: friend.profile.name,
          avatar: friend.profile.avatar.url ?? "/zalo.svg",
          background: friend.profile.background.url ?? "/zalo.svg",
        }));
        setRecommendedFriends(newFriendList);
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to get recommended friends");
    }
    setLoading(false);
  };

  const getFriendByPhone = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`users/get/phone/${phone}`);
      if (response.status === 200) {
        return response.data.user;
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to get friend by phone");
    }
    setLoading(false);
  };

  const getFriendById = async (uid) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`users/get/uid/${uid}`);
      if (response.status === 200) {
        return response.data.user;
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to get friend by id");
    }
    setLoading(false);
  };

  const addFriend = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("users/send-add-friend", {
        phone,
      });
      if (response.status === 200) {
        showSuccessToast("Chấp nhận yêu cầu kết bạn thành công");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        showErrorToast(error.response.data.message);
      } else {
        showErrorToast("Failed to send friend request");
      }
    }
    setLoading(false);
  };

  const acceptFriend = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/accept-add-friend", {
        phone,
      });
      if (response.status === 200) {
        showSuccessToast("Chấp nhận yêu cầu kết bạn thành công");
        await reloadAuthUser();
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Chấp nhận yêu cầu kết bạn thất bại");
    }
    setLoading(false);
  };

  const rejectFriend = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/users/reject-request-add-friend",
        {
          phone,
        }
      );
      if (response.status === 200) {
        showSuccessToast("Friend request rejected");
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to reject friend request");
    }
    setLoading(false);
  };

  const cancelFriendRequest = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/users/cancel-request-add-friend", { phone });
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const unFriend = async (phone) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/unfriend", {
        phone,
      });
      if (response.status === 200) {
        await reloadAuthUser();
        showSuccessToast("Huỷ kết bạn thành công");
        return true;
      }
    } catch (error) {
      console.log(error);
      showErrorToast("Failed to unfriend");
      return false;
    }
    setLoading(false);
  };

  return {
    friends,
    recommendedFriends,
    loading,
    getAllFriends,
    getFriendByPhone,
    getFriendById,
    getRecommendedFriends,
    addFriend,
    acceptFriend,
    rejectFriend,
    cancelFriendRequest,
    unFriend,
    showErrorToast,
    showSuccessToast
  };
};

export default useFriend;
