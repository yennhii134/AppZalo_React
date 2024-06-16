import axiosInstance from "../api/axiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import useToast from "../hooks/useToast"
const useFriend = () => {
  const { reloadAuthUser } = useAuthContext();
  const { showToastError, showToastSuccess } = useToast()

  const getFriends = async () => {
    try {
      const response = await axiosInstance.get("users/get/friends");
      if (response.status === 200) {
        return response.data.friends
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      showToastError("Failed to get friends");
    }
  };

  const getRecommendedFriends = async () => {
    try {
      const response = await axiosInstance.get("users/get/random-not-friends");
      if (response.status === 200) {
        return response.data.users;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      showToastError("Failed to get recommended friends");
    }
  };

  const getFriendByPhone = async (phone) => {
    try {
      const response = await axiosInstance.get(`users/get/phone/${phone}`);
      if (response.status === 200) {
        return response.data.user;
      }
    } catch (error) {
      console.log(error);
      showToastError("Failed to get friend by phone");
    }
  };

  const getFriendById = async (uid) => {
    try {
      const response = await axiosInstance.get(`users/get/uid/${uid}`);
      if (response.status === 200) {
        return response.data.user;
      }
    } catch (error) {
      console.log(error);
      showToastError("Failed to get friend by id");
    }
  };

  const addFriend = async (phone) => {
    try {
      const response = await axiosInstance.post("users/send-add-friend", {
        phone,
      });
      if (response.status === 200) {
        showToastSuccess("Gửi yêu cầu kết bạn thành công");
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 400) {
        showToastError(error.response.data.message);
      } else {
        showToastError("Failed to send friend request");
      }
    }
  };

  const acceptFriend = async (phone) => {
    try {
      const response = await axiosInstance.post("/users/accept-add-friend", {
        phone,
      });
      if (response.status === 200) {
        showToastSuccess("Chấp nhận yêu cầu kết bạn thành công");
        await reloadAuthUser();
      }
    } catch (error) {
      console.log(error);
      showToastError("Chấp nhận yêu cầu kết bạn thất bại");
    }
  };

  const rejectFriend = async (phone) => {
    try {
      const response = await axiosInstance.post(
        "/users/reject-request-add-friend", { phone }
      );
      if (response.status === 200) {
        showToastSuccess("Friend request rejected");
      }
    } catch (error) {
      console.log(error);
      showToastError("Failed to reject friend request");
    }
  };

  const cancelFriendRequest = async (phone) => {
    try {
      const response = await axiosInstance.post(
        "/users/cancel-request-add-friend", { phone });
      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unFriend = async (friendId) => {
    try {
      const response = await axiosInstance.post("/users/unfriend", {
        friendId,
      });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return {
    getFriends,
    getFriendByPhone,
    getFriendById,
    getRecommendedFriends,
    addFriend,
    acceptFriend,
    rejectFriend,
    cancelFriendRequest,
    unFriend,
  };
};

export default useFriend;
