import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useFriend from "../../hooks/useFriend";
import { useAuthContext } from "../../contexts/AuthContext";
import useToast from "../../hooks/useToast";
import { useSelector } from "react-redux";
import { selectFriends } from "../../redux/stateFriendsSlice";

const AddFriends = () => {
  const { authUser, reloadAuthUser } = useAuthContext();
  const {
    getFriendByPhone,
    addFriend,
    acceptFriend,
    unFriend,
    rejectFriend,
    cancelFriendRequest,
  } = useFriend();

  const [phone, setPhone] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [sentRequest, setSentRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const { showToastError, showToastSuccess } = useToast()
  const friends = useSelector(selectFriends);

  const handleSearch = async () => {
    if (phone === "") {
      showToastError("Vui lòng nhập số điện thoại để tìm kiếm");
      return;
    }

    const currentUserPhone = authUser.phone;

    if (phone === currentUserPhone) {
      showToastError("Số điện thoại tài khoản hiện tại");
      return;
    }

    const userSearch = await getFriendByPhone(phone);

    if (userSearch) {
      setSearchedUser(userSearch);
    }
  };

  const handleAddFriend = async (friend) => {
    setIsLoading(true)
    try {
      await addFriend(friend.phone);
      showToastSuccess("Đã gửi lời mời kết bạn");
      setIsLoading(false)
      setSentRequest(true);
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showToastError("Gửi lời mời không thành công!");
      setIsLoading(false)
    }
  };
  const handleCancelFriendRequest = async (friend) => {
    setIsLoading(true)
    try {
      await cancelFriendRequest(friend.phone);
      showToastSuccess("Đã hủy lời mời kết bạn");
      setSentRequest(true);
      setIsLoading(false)
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showToastError("Hủy kết bạn không thành công!");
      setIsLoading(false)
    }
  };

  const handleAcceptFriend = async (friend) => {
    try {
      await acceptFriend(friend.phone);
      showToastSuccess("Đã chấp nhận lời mời kết bạn");
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showToastError("Chấp nhận lời mời kết bạn thất bại!");
    }
  };

  const handleRejectFriend = async (friend) => {
    try {
      await rejectFriend(friend.phone);
      showToastSuccess("Đã từ chối lời mời kết bạn");
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showToastError("Từ chối lời mời kết bạn thất bạn");
    }
  };

  const handleUnFriend = async (friend) => {
    try {
      await unFriend(friend.phone);
      showToastSuccess("Đã hủy kết bạn");
      reloadAuthUser();
    } catch (error) {
      console.log(error);
      showToastError("Hủy kết bạn thất bại!");
    }
  };

  const renderFriendItem = ({ item }) => {
    const isFriend = friends.some((f) => f.userId === item.id);

    const isSent = authUser?.requestSent?.includes(item.id);
    const isReceived = authUser?.requestReceived?.includes(item.id);

    return (
      <View
        style={{ flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, }}>
        <Image source={{ uri: item.profile.avatar.url }}
          style={{ width: 50, height: 50, borderRadius: 25 }} />
        <Text style={{ marginLeft: 10 }}>{item.profile.name}</Text>
        {isFriend ? (
          <Pressable
            onPress={() => handleUnFriend(item)}
            style={{ marginLeft: "auto", paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "red", }}>
            <Text style={{ color: "white" }}>Hủy kết bạn</Text>
          </Pressable>
        ) : isSent ? (
          <Pressable
            onPress={() => handleCancelFriendRequest(item)}
            style={{ marginLeft: "auto", paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "orange", }}>
            {isLoading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text style={{ color: "white" }}>Hủy lời mời</Text>
            )}
          </Pressable>
        ) : isReceived ? (
          <View style={{ flexDirection: "row", marginLeft: "auto", justifyContent: 'space-evenly', width: '55%' }}>
            <Pressable
              onPress={() => handleRejectFriend(item)}
              style={{ marginLeft: "auto", paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "red", }}>
              <Text style={{ color: "white" }}>Từ chối</Text>
            </Pressable>
            <Pressable
              onPress={() => handleAcceptFriend(item)}
              style={{ marginLeft: "auto", paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "green", }}>
              <Text style={{ color: "white" }}>Chấp nhận</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => handleAddFriend(item)}
            style={{ marginLeft: "auto", paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "green", }}>
            {isLoading ? (
              <ActivityIndicator color="black" size="small" />
            ) : (
              <Text style={{ color: "white" }}>Kết bạn</Text>
            )}
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E9EB" }}>
      <View style={{ height: 60, backgroundColor: "white", marginTop: 2, flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
        <TextInput style={{ height: 40, width: "80%", borderRadius: 10, color: "black", backgroundColor: "#F2F2F2", paddingStart: 20, }}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#8B8B8B"
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        <Pressable style={{ backgroundColor: "#F2F2F2", borderRadius: 50, marginLeft: 10, }}
          onPress={handleSearch}>
          <Ionicons name="arrow-forward" size={22} style={{ margin: 10 }} />
        </Pressable>
      </View>

      {searchedUser && (
        <FlatList
          data={[searchedUser]}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default AddFriends;
