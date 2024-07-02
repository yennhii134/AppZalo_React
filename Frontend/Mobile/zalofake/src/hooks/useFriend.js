import { useDispatch } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import useToast from "../hooks/useToast"
import { deleteFriend } from "../redux/stateFriendsSlice";
import { useAuthContext } from "../contexts/AuthContext";

const useFriend = () => {
  const { showToastError, showToastSuccess } = useToast()
  const dispatch = useDispatch()
  const { reloadAuthUser } = useAuthContext()

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
        await reloadAuthUser();
        return true;
      }
    } catch (error) {
      console.log(error);
      showToastError("Gửi lời mời thất bại");
      return false;
    }
  };

  const acceptFriend = async (friendId) => {
    try {
      const response = await axiosInstance.post("/users/accept-add-friend", {
        friendId,
      });
      if (response.status === 200) {
        showToastSuccess("Chấp nhập kết bạn thành công")
        await reloadAuthUser();
        return true;
      }
    } catch (error) {
      console.log(error);
      showToastSuccess("Chấp nhập kết bạn thất bại")
      return false;
    }
  };

  const rejectFriend = async (friendId) => {
    try {
      const response = await axiosInstance.post(
        "/users/reject-request-add-friend", { friendId }
      );
      if (response.status === 200) {
        showToastSuccess("Đã từ chối lời mời kết bạn");
        await reloadAuthUser();
        return true;
      }
    } catch (error) {
      showToastSuccess("Từ chối lời mời kết bạn thất bại");
      console.log(error);
      return false;
    }
  };

  const cancelFriendRequest = async (friendId) => {
    try {
      const response = await axiosInstance.post(
        "/users/cancel-request-add-friend", { friendId });
      if (response.status === 200) {
        showToastSuccess("Đã hủy lời mời kết bạn");
        await reloadAuthUser();
        return true;
      }
    } catch (error) {
      console.log(error);
      showToastError("Hủy kết bạn thất bại");
      return false;
    }
  };

  const unFriend = async (friendId) => {
    try {
      const response = await axiosInstance.post("/users/unfriend", {
        friendId,
      });
      if (response.status === 200) {
        dispatch(deleteFriend(friendId))
        showToastSuccess("Huỷ kết bạn thành công")
        return true;
      }
    } catch (error) {
      console.log(error);
      showToastSuccess("Hủy kết bạn thất bại");
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
