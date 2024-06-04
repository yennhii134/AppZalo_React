import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  Modal, ActivityIndicator, StyleSheet
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import axiosInstance from "../../../api/axiosInstance";
import { useAuthContext } from "../../../contexts/AuthContext";
import useGroup from "../../../hooks/useGroup";
import useMessage from "../../../hooks/useMessage";
import * as ImagePicker from "expo-image-picker";
import { useSocketContext } from "../../../contexts/SocketContext";
import { useDispatch } from "react-redux";
import { setIsGroup } from "../../../redux/stateCreateGroupSlice";
import avatarGroup from '../../../../assets/avatarGroup.png'

const MessageSettings = ({ navigation, route }) => {
  const { item } = route.params
  const [conver, setConver] = useState(item);
  const { showToastError, showToastSuccess, addMessage, sendMessage } = useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [modalAddMember, setModalAddMember] = useState(false);
  const [name, setName] = useState("");
  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [isPhoAdmin, setIsPhoAdmin] = useState(false);
  const { authUser } = useAuthContext();
  const [textSearch, setTextSearch] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState([]);
  const [listSearch, setListSearch] = useState([]);
  const [isLoadingUpdateName, setIsLoadingUpdateName] = useState(false);
  const [isLoadingUpdataAvatar, setIsLoadingUpdataAvatar] = useState(false);
  const [isLoadingAddMem, setIsLoadingAddMem] = useState(false);
  const [isLoadingLeaveGroup, setIsLoadingLeaveGroup] = useState(false);
  const [isLoadingRemoveGroup, setIsLoadingRemoveGroup] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [memberSelected, setMemberSelected] = useState(null);
  const [listFriendCanSearch, setListFriendCanSearch] = useState([]);
  const [isModalXacNhanXoa, setIsModalXacNhanXoa] = useState(false);
  const [isModalXacNhanXoaAdmin, setIsModalXacNhanXoaAdmin] = useState(false);
  const [isModalMakeAdminToOut, setIsModalMakeAdminToOut] = useState(false);
  const [isModeQTV, setIsModeQTV] = useState(false);
  const [isModeDeleteQTV, setIsModeDeleteQTV] = useState(false);
  const [isMakeAdmin, setIsMakeAdmin] = useState(false)
  const [listAdmin, setListAdmin] = useState([]);
  const { updateGroup, addMember, removeMember, deleteGroup, leaveGroup, addAdmin, getGroup, changeAdmins } = useGroup();
  const [selectedImage, setSelectedImage] = useState(null);
  const [idGroupAdmin, setIdGroupAdmin] = useState(null)
  const { isNewSocket, newSocketData, setNewSocketData } = useSocketContext();
  const dispatch = useDispatch()
  const [allFriend, setAllFriend] = useState([])
  const [isXacNhan, setIsXacNhan] = useState(false)
  const [avatarGr] = useState(avatarGroup)
  const searchInputRef = useRef(null);
  const [isSearch, setIsSearch] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Tùy chọn
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation]);

  useEffect(() => {
    fetchData()
    fetchFriends()
  }, [item])

  const fetchData = async () => {
    if (item.conversation !== null) {
      if (conver.tag === 'group') {
        const getGroupData = await getGroup(conver._id)
        setConver({ ...conver, createBy: getGroupData.createBy, admins: getGroupData.admins, participants: getGroupData.conversation.participants })
        setIdGroupAdmin(getGroupData.createBy?._id)
        setName(getGroupData.groupName);
        if (getGroupData?.createBy?._id === authUser._id) {
          setIsGroupAdmin(true);
        } else if (getGroupData.admins?.includes(authUser?._id)) {
          setIsPhoAdmin(true);
        }
        setListAdmin(getGroupData?.admins);
      } else {
        setConver({ ...conver, participants: conver.conversation.participants })
        setName(conver.name);
      }
    } else {
      setName(conver.name);
      const converNew = [
        { profile: { name: conver.name, avatar: conver.avatar }, _id: conver._id },
        { profile: { name: authUser.profile.name, avatar: authUser.profile.avatar }, _id: authUser._id }
      ]
      setConver({ ...conver, participants: converNew })
    }
  };

  // cập nhật tên nhóm
  const updateGroupInfo = async () => {
    setIsLoadingUpdateName(true);
    if (name.trim() === "") {
      setName(conver.name);
      setIsEditing(false);
      showToastError('Tên không được rỗng')
      return;
    }
    if (name === conver.name) {
      setIsLoadingUpdateName(false);
      showToastError('Tên phải khác với tên ban đầu')
    } else {
      try {
        const response = await updateGroup(conver._id, { name });
        if (response) {
          let textMessage = authUser?.profile?.name + ' đã cập nhật tên nhóm thành ' + name;
          await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText')
          dispatch(setIsGroup())
          setIsEditing(false);
          setIsLoadingUpdateName(false);
          showToastSuccess("Cập nhật thông tin nhóm thành công");
        }
        setIsLoadingUpdateName(false);
      } catch (error) {
        setIsLoadingUpdateName(false);
        console.error(error);
        showToastError("Cập nhật thông tin nhóm thất bại");
      }
    }
  };
  // Thêm thành viên
  const addMemberToGroup = async () => {

    setIsLoadingAddMem(true);
    if (selectedFriends.length > 0) {
      let selectedFr = []
      let selectedFrName = "";
      selectedFriends.map((f) => {
        selectedFr.push(f.id);
        selectedFrName = selectedFrName + f.name + ' - ';
      })
      const groupData = {
        groupId: conver._id,
        members: selectedFr
      };
      const rs = await addMember(conver._id, groupData);
      if (rs) {
        let textMessage = authUser?.profile?.name + ' đã thêm ' + selectedFrName + ' vào nhóm!';
        await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText');
        dispatch(setIsGroup())
        setModalAddMember(false);
        setSelectedFriends([]);
        showToastSuccess("Thêm thành viên vào nhóm thành công");
      } else {
        showToastError("Thêm thành viên vào nhóm thất bại");
      }
      setIsLoadingAddMem(false);
      setModalAddMember(false);
    } else {
      setIsLoadingAddMem(false);
      showToastError("Bạn chưa chọn thành viên");
    }
  };

  const toggleModal = () => {
    setIsModalXacNhanXoa(!isModalXacNhanXoa);
  };

  const toggleModalXoa = () => {
    setIsModalXacNhanXoaAdmin(!isModalXacNhanXoaAdmin);
  };


  // xóa thành viên
  const removeMemberInGroup = async (member) => {
    try {
      setIsLoadingAddMem(true);
      let selectedFrName = member.profile?.name;
      let selectedFr = [member._id]
      const groupData = {
        groupId: conver._id,
        members: selectedFr
      };
      const response = await removeMember(conver._id, groupData);
      if (response) {
        let textMessage = authUser?.profile?.name + ' đã xóa ' + selectedFrName + ' khỏi nhóm!';
        await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText')
        toggleModal()
        dispatch(setIsGroup())
        setIsLoadingAddMem(false);
        showToastSuccess('Xóa thành viên khỏi nhóm thành công')
      }
    } catch (error) {
      console.error(error);
      toggleModal();
      setIsLoadingAddMem(false);
      if (error.response.data.error === "Group must have at least 2 members") {
        showToastError('Nhóm phải có ít nhất 2 thành viên')
      } else {
        showToastError('Xóa thành viên khỏi nhóm thất bại')
      }
    }
  };
  const fetchFriends = async () => {
    try {
      const response = await axiosInstance.get("/users/get/friends");
      setAllFriend(response.data.friends)
    } catch (error) {
      console.log(error);
    }
  }
  // load danh sách bạn, set danh sách bạn có thể add vào group
  const filterFriendToAdd = () => {
    const filterFriend = allFriend.filter((itemAllFriend) => {
      return !conver.participants.some((itemConver) => itemConver._id === itemAllFriend.userId)
    }).map((friend) => {
      return {
        id: friend.userId,
        name: friend.profile.name,
        avatar: friend.profile.avatar?.url,
        phone: friend.phone
      }
    })
    setListSearch(filterFriend);
    setListFriendCanSearch(filterFriend)
  }
  // Search bạn để add vào group
  useEffect(() => {
    if (textSearch === '') {
      setListSearch(listFriendCanSearch)
      setIsSearch(false)
    } else {
      const filteredFriends = listFriendCanSearch.filter((friend) => {
        return (
          friend.name.toLowerCase()?.includes(textSearch.toLowerCase()) || friend.phone === textSearch
        );
      });
      if (filteredFriends.length === 0) {
        setIsSearch(true)
      } else if (filteredFriends.length > 0) {
        const newRadioButtons = [];
        for (const friend of filteredFriends) {
          const item = {
            id: friend.userId,
            name: friend.name,
            avatar: friend.avatar,
            phone: friend.phone
          };
          newRadioButtons.push(item);
        }
        setListSearch(newRadioButtons);
        setIsSearch(false)
      }
    }
  }, [textSearch])

  //giải tán nhóm
  const handleDeleteGroup = async () => {
    try {
      setIsLoadingRemoveGroup(true);
      const response = await deleteGroup(conver._id);
      if (response) {
        showToastSuccess("Giải tán nhóm thành công");
        setIsLoadingRemoveGroup(false);
        navigation.navigate("ChatComponent");
      }
    } catch (error) {
      setIsLoadingRemoveGroup(false);
      console.error(error);
      showToastError("Giải tán nhóm thất bại");
    }
  };
  //rời nhóm
  const handleLeaveGroup = async () => {
    if (idGroupAdmin === authUser._id) {
      setIsModalMakeAdminToOut(true)
    } else {
      try {
        setIsLoadingLeaveGroup(true);
        const response = await leaveGroup(conver._id);
        if (response) {
          let textMessage = authUser?.profile?.name + ' đã rời khỏi nhóm!';
          await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText')
          showToastSuccess("Rời nhóm thành công");
          setIsLoadingLeaveGroup(false);
          dispatch(setIsGroup())
          navigation.navigate("ChatComponent");
        }
      } catch (error) {
        console.error(error); setIsLoadingLeaveGroup(false);
        showToastError("Rời nhóm thất bại");
      }
    }
  };
  // chọn bạn để add group
  const handleFriendSelection = (item) => {
    if (selectedFriends?.includes(item)) {
      setSelectedFriends((prevState) =>
        prevState.filter((friend) => friend.id !== item.id)
      );
    } else {
      setSelectedFriends((prevState) => [...prevState, item]);
    }
  };
  const isFriendSelected = (friend) => {
    return selectedFriends?.includes(friend);
  };

  const handleDeleteFriendSelected = (item) => {
    setSelectedFriends(
      selectedFriends.filter((friend) => friend.id !== item.id)
    );
  };

  // Thêm quyền phó nhóm
  const toggleModalQTV = () => {
    if (listAdmin.length === (conver.participants.length)) {
      showToastError("Tất cả thành viên đều là quản trị viên")
    } else {
      setSelectedAdmin([]);
      setIsModeQTV(!isModeQTV);
    }
  };

  // Xoá quyền phó nhóm
  const toggleModalDeleteQTV = () => {
    if (listAdmin.length === 1) {
      showToastError("Nhóm chưa có quản trị viên")
    } else {
      setSelectedAdmin([]);
      setIsModeDeleteQTV(!isModeDeleteQTV);
    }
  };
  // Thay đổi admin
  const toggleModalMakeAdmin = () => {
    setSelectedAdmin([]);
    setIsMakeAdmin(!isMakeAdmin);
  }
  // chọn bạn để làm admin
  const handleFriendSelectionAdmin = (item) => {
    if (selectedAdmin?.includes(item)) {
      setSelectedAdmin((prevState) =>
        prevState.filter((friend) => friend.id !== item._id)
      );
    } else {
      setSelectedAdmin((prevState) => [...prevState, item]);
    }
  };

  const handleDeleteAdminSelected = (item) => {
    setSelectedAdmin(
      selectedAdmin.filter((friend) => friend._id !== item._id)
    );
  };
  const isAdminSelected = (friend) => {
    return selectedAdmin?.includes(friend);
  };
  const handleAddOrDeleteAdmin = async (type) => {
    let selectedFr = []
    let selectedFrName = "";
    selectedAdmin.map((f) => {
      selectedFr.push(f._id);
      selectedFrName = selectedFrName + f?.profile?.name + ' - ';
    })
    const groupData = {
      members: selectedFr,
      typeChange: type,
      groupId: conver._id,
    };
    const rs = await addAdmin(groupData)
    return { rs, selectedFrName };
  }
  useEffect(() => {
    if (selectedAdmin.length > 0) {
      setIsXacNhan(true)
    } else {
      setIsXacNhan(false)
    }
  }, [selectedAdmin])

  // Thêm admin
  const addAdminInGroup = async () => {
    setIsLoadingAddMem(true);
    const { rs, selectedFrName } = await handleAddOrDeleteAdmin('add')
    if (rs) {
      setSelectedAdmin([]);
      toggleModalQTV();
      let textMessage = authUser?.profile?.name + ' đã bổ nhiệm ' + selectedFrName + ' làm phó nhóm!';
      await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText');
      dispatch(setIsGroup())
    } else {
      toggleModalQTV();
      setSelectedAdmin([]);
      showToastError("phân quyền admin vào nhóm thất bại");
    }
    setIsLoadingAddMem(false);
  };
  // Xóa admin
  const removeAdmin = async () => {
    setIsLoadingAddMem(true);
    const { rs, selectedFrName } = await handleAddOrDeleteAdmin('remove')
    if (rs) {
      setIsModeDeleteQTV(false);
      setSelectedAdmin([]);
      let textMessage = authUser?.profile?.name + ' đã xóa quyền admin của ' + selectedFrName + '!';
      await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText');
      dispatch(setIsGroup())
    } else {
      setIsModeDeleteQTV(false);
      setSelectedAdmin([]);
      showToastError("Xóa quyền admin thất bại");
    }
    setIsLoadingAddMem(false);
  };
  // Chuyển quyền admin
  const makeMemberToAdmin = async () => {
    if (selectedAdmin.length > 1) {
      showToastError("Chỉ được chọn một thành viên")
    }
    else {
      setIsLoadingAddMem(true);
      const response = await changeAdmins(conver._id, selectedAdmin[0]._id)
      if (response) {
        showToastSuccess("Chuyển quyền trưởng nhóm cho " + selectedAdmin[0].profile.name + " thành công")
        toggleModalMakeAdmin()
        let textMessage = authUser?.profile?.name + ' đã chuyển quyền trưởng nhóm cho ' + selectedAdmin[0].profile.name + '.';
        await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText');
        dispatch(setIsGroup())
        handleSetAdmin(response.group, false)
      } else {
        toggleModalMakeAdmin()
        showToastError("Chuyển quyền trưởng nhóm thất bại")
      }
      setIsLoadingAddMem(false);
    }
  }
  const handleSetAdmin = (group, isAdmin) => {
    setConver({ ...conver, createBy: group.createBy, admins: group.admins })
    setIdGroupAdmin(group.createBy._id)
    setIsGroupAdmin(isAdmin)
    setListAdmin(group.admins)
  }
  useEffect(() => {
    const fetchSocket = async () => {
      if (isNewSocket === "add-to-group") {
        const group = newSocketData
        if (group !== null && group.addMembers && group.group._id === conver._id) {
          fetchData()
        }
      }
      if (isNewSocket === "remove-from-group") {
        const group = newSocketData;
        if (group && group.removeMembers && group.id === conver._id) {
          const idRemove = group.removeMembers[0]
          if (authUser._id === idRemove) {
            showToastSuccess(`Bạn đã bị xoá khỏi nhóm ${group.name}`)
            navigation.navigate("ChatComponent");
            setNewSocketData(null)
          } else {
            const userRemove = conver.participants.find(item => item._id === group.removeMembers[0])
            if (userRemove) {
              showToastSuccess(`${userRemove.profile.name} đã bị xoá khỏi nhóm`)
              const updateParticipants = conver.participants.filter(item => item._id !== group.removeMembers[0])
              setConver({ ...conver, participants: updateParticipants })
              setNewSocketData(null)
            }
          }
        }
      }
      if (isNewSocket === "leave-group") {
        const group = newSocketData
        if (group && group.leaveMember && group.id === conver._id) {
          if (group.leaveMember !== authUser._id) {
            const userRemove = conver.participants?.find(item => item._id === group.leaveMember)
            if (userRemove) {
              showToastSuccess(`${userRemove?.profile?.name} đã rời khỏi nhóm`)
              const updateParticipants = conver.participants.filter(item => item._id !== group.leaveMember)
              setConver({ ...conver, participants: updateParticipants })
              setNewSocketData(null)
            }
          }
        }
      }
      if (isNewSocket === "change-admins") {
        const { group, members, typeChange } = newSocketData;
        if (group !== null && group.id === conver._id) {
          if (typeChange === 'add') {
            for (const member of members) {
              setListAdmin((preAdmin) => [...preAdmin, member])
            }
          }
          if (typeChange === 'remove') {
            for (const member of members) {
              setListAdmin(preAdmin => preAdmin.filter(admin => admin !== member))
            }
          }
        }
      }
      if (isNewSocket === "update-group") {
        const group = newSocketData
        if (group && group.id === conver._id) {
          setConver(preConver => ({
            ...preConver,
            name: group.name,
            avatar: group.avatar
          }))
          setName(group.name)
        }
      }
      if (isNewSocket === "member-to-admin") {
        const group = newSocketData
        // console.log("member-to-admin", group);
        if (group && group.group.id === conver._id && group.group.createBy._id === authUser._id) {
          showToastSuccess("Bạn đã trở thành trưởng nhóm")
          handleSetAdmin(group.group, true)
        }
      }
    }
    fetchSocket()
  }, [isNewSocket, newSocketData])

  const renderListItem = (item, index) => (
    <Pressable
      key={index}
      style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
    >
      <View style={{ height: 45, width: 45, borderRadius: 50 }}></View>
      <View
        style={{ width: "75%", flexDirection: "row", alignItems: "center" }}
      >
        <View style={{ padding: 10 }}>
          <Image
            source={{ uri: item.avatar || "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png" }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        </View>
        <Text style={{ fontWeight: "500", marginLeft: 0 }}>{item.name}</Text>
      </View>
      <Pressable onPress={() => { handleFriendSelection(item) }}>
        <View style={{ padding: 13, width: 24, height: 24, backgroundColor: '#F3F5F6', borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#37333A' }}>
          {isFriendSelected(item) ? (
            <Pressable style={{ width: 25, height: 25, backgroundColor: '#0091FF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} onPress={
              () => handleDeleteFriendSelected(item)
            }>
              <Ionicons color='white' size={27} name="checkmark-circle" />
            </Pressable>
          ) : (
            <View></View>
          )}
        </View>
      </Pressable>

    </Pressable>
  );

  const handleShowAddMember = () => {
    filterFriendToAdd()
    setModalAddMember(true);
  };

  const handleHideAddMember = () => {
    setModalAddMember(false);
  };

  // Cập nhật avatar
  const openImagePicker = async () => {
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
    } else {
      console.log("No image selected");
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      setIsLoadingUpdataAvatar(true);
      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
      const response = await updateGroup(conver._id, formData);
      if (response) {
        let textMessage = authUser?.profile?.name + ' đã cập nhật avatar mới';
        await sendMessage(conver._id, addMessage(textMessage, conver.tag, null), 'sendText')
        setIsLoadingUpdataAvatar(false);
        showToastSuccess("Cập nhật avtar nhóm thành công");
      }
      setIsLoadingUpdataAvatar(false);

    } catch (error) {
      setIsLoadingUpdataAvatar(false);
      console.error(error);
      console.log("Error", error.message || "Failed to update avatar");
    } finally {
      setIsLoadingUpdataAvatar(false);
      closeModal();
    }
  };
  const openModal = () => {
    if (conver?.createBy?._id === authUser._id) {
      setSelectedImage(conver.avatar);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handlePhanQuyen = () => {
    if (isModeQTV) {
      addAdminInGroup()
    }
    else if (isModeDeleteQTV) {
      removeAdmin()
    } else if (isMakeAdmin) {
      makeMemberToAdmin()
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={{ backgroundColor: "white", alignItems: "center", paddingTop: 10, }}       >
          <View style={{ justifyContent: "center" }}>
            <Pressable onPress={openModal}>
              <Image
                source={conver.avatar === "https://res.cloudinary.com/dq3pxd9eq/image/upload/v1715763881/Zalo_Fake_App/qhncxk41jtp39iknujyz.png" ? avatarGr : { uri: conver.avatar }}
                style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: "#ccc", }}
              />
            </Pressable>
          </View>
          <View style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingTop: 10, }}     >
            <TextInput style={{ fontSize: 18, fontWeight: "bold", color: "black", borderBottomWidth: isEditing ? 1 : 0, borderColor: 'black', marginBottom: 5 }}
              value={name}
              editable={isEditing}
              onChangeText={setName}
            />
            {(isGroupAdmin || isPhoAdmin) && (
              <View style={{ display: 'flex', flexDirection: "row", justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'flex-end' }}>
                {isEditing ? (
                  <View style={{ flexDirection: 'row', padding: 5 }}>
                    <Pressable style={{ width: 50, height: 35, borderWidth: 1, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#9cf5ff', borderRadius: 10 }}
                      onPress={() => { setIsEditing(false); setName(conver.name); }}>
                      <FontAwesome5 name="times" size={20} color="black" />
                    </Pressable>
                    <Pressable style={{ width: 50, height: 35, borderWidth: 1, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#9cf5ff', borderRadius: 10 }}
                      onPress={updateGroupInfo}>
                      {isLoadingUpdateName ? (
                        <ActivityIndicator color="black" size="16" />
                      ) : (
                        <FontAwesome5 name="check" size={20} color="black" />)}
                    </Pressable>
                  </View>
                ) : (
                  <View>
                    <Pressable style={{ width: 50, height: 35, borderWidth: 1, borderColor: 'blue', justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: '#9cf5ff', borderRadius: 10 }}
                      onPress={() => { setIsEditing(true); }}>
                      <FontAwesome5 name="pen" size={20} color="black" />
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
          {conver.tag === 'friend' ? (<View>
            <Pressable style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate("FriendProfile", { user: conver })}>
              <Ionicons name="person-circle-outline" size={26} color='black'></Ionicons>
              <Text style={{ fontSize: 16, marginLeft: 4, fontWeight: '500' }}>Xem trang cá nhân</Text>
            </Pressable>
          </View>) : (
            <View style={{ flexDirection: "row", alignItems: "center", width: "90%", borderWidth: 1, borderColor: "orange", borderRadius: 20, marginTop: 20, marginHorizontal: 10, padding: 10, justifyContent: "center", }} >
              <Text>{"Quản Trị Viên :"}</Text>
              <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
                {conver?.createBy?.profile?.name}
              </Text>
            </View>)}
        </View>
        <View
          style={{ backgroundColor: "white", alignItems: "center", marginTop: 1, }}>
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 10, position: "relative", width: "100%", }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{"Danh sách thành viên"}</Text>
            {conver.tag === 'friend' ? (<View></View>) : (
              <Pressable style={{ position: "absolute", top: 10, right: 20 }} onPress={handleShowAddMember}>
                <Ionicons name="person-add" size={22} color="#1b93ff" />
              </Pressable>)}
          </View>
          <ScrollView style={{ flex: 1, marginTop: 5, marginHorizontal: 10, width: "100%", paddingHorizontal: 10, }}>
            {conver?.participants?.map((member, index) =>
            (<View key={index}>
              {/* {member._id !== authUser._id && ( */}
              <View style={{ flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#eee", borderRadius: 10, marginBottom: 5, }}>
                <View style={{ flexDirection: "row", alignItems: "center", width: '90%' }}>
                  <Image
                    source={{ uri: member.profile?.avatar?.url || member.profile?.avatar || "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png" }}
                    style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: "black", }} />
                  <View style={{ width: '80%' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={{ marginLeft: 10, fontWeight: '500' }}>{member.profile?.name}</Text>
                      {member._id === authUser._id ? <Text style={{ marginLeft: 5, color: 'gray', fontWeight: '600' }}>(Bạn)</Text> : null}
                    </View>
                    <View style={{ paddingTop: 5, marginLeft: 5 }}>
                      {conver.tag === "group" &&
                        conver.createBy?._id === member._id ? (
                        <View style={{ flexDirection: 'row', width: '42%', justifyContent: 'space-between' }}>
                          <FontAwesome5 name="key" size={16} color="#ffcd03" />
                          <Text style={{ color: 'gray' }}>Trưởng nhóm</Text>
                        </View>
                      ) : (
                        <View>
                          {listAdmin?.includes(member._id) && (
                            // onPress={isGroupAdmin ? handleDeleteGroup : handleLeaveGroup}
                            <View style={{ flexDirection: 'row', width: '35%', justifyContent: 'space-between' }}>
                              <Pressable
                                onPress={isGroupAdmin ? () => { toggleModalXoa() }
                                  : null}>
                                <FontAwesome5 name="key" size={16} color="black" regular={false} />
                              </Pressable>
                              <Text style={{ color: 'gray' }}>Phó nhóm</Text>
                            </View>
                          )}</View>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: "row", width: '10%' }}>
                  {(isGroupAdmin || isPhoAdmin) && (member._id !== authUser._id) && (member._id !== idGroupAdmin && (
                    <View >
                      {(isModeQTV && !listAdmin?.includes(member?._id)) || (isModeDeleteQTV && listAdmin?.includes(member?._id)) || (isMakeAdmin) ? (
                        <Pressable onPress={() => { handleFriendSelectionAdmin(member) }}>
                          <View style={{ padding: 13, width: 30, height: 30, backgroundColor: '#F3F5F6', borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#37333A' }}>
                            {isAdminSelected(member) ? (
                              <Pressable style={{ width: 30, height: 30, backgroundColor: '#0091FF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => handleDeleteAdminSelected(member)}>
                                <Ionicons color='white' size={27} name="checkmark-circle" />
                              </Pressable>
                            ) : (
                              <View></View>
                            )}
                          </View>
                        </Pressable>
                      ) : (<Pressable onPress={() => { setMemberSelected(member); toggleModal(); }}>
                        <Ionicons name="person-remove" size={20} color="#ff1637" />
                      </Pressable>)
                      }
                    </View>
                  )
                  )}
                </View>
              </View>
              {/* )} */}
            </View>
            ))}
          </ScrollView>
        </View>
        {conver.tag === 'friend' ? (<View></View>) : (
          <View style={{ backgroundColor: "white", marginTop: 1 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", paddingTop: 10, }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {"Thiết lập nhóm"}
              </Text>
            </View>
            <View>
              {isGroupAdmin && (
                <View>
                  {isModeQTV || isModeDeleteQTV || isMakeAdmin ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }}>
                      <Pressable style={{ justifyContent: "center", alignItems: 'center', width: 80, height: 40, borderRadius: 10, backgroundColor: '#abe9fa' }}
                        onPress={() => { setIsModeQTV(false);; setIsModeDeleteQTV(false); setIsMakeAdmin(false) }}>
                        <Text style={{ color: "gray", fontSize: 16, fontWeight: 'bold' }}> Hủy </Text>
                      </Pressable>
                      {isXacNhan &&
                        <Pressable style={{ justifyContent: "center", alignItems: 'center', width: 90, height: 40, borderRadius: 10, backgroundColor: '#abe9fa' }}
                          onPress={handlePhanQuyen}>
                          {isLoadingAddMem ? (
                            <ActivityIndicator color="white" size="large" />
                          ) : (
                            <Text style={{ color: "gray", fontSize: 16, fontWeight: 'bold' }}>Xác nhận</Text>
                          )}
                        </Pressable>
                      }
                    </View>) : (
                    <View>
                      <Pressable style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 20, }}
                        onPress={toggleModalQTV} >
                        <Text style={{ color: "gray", marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Bổ nhiệm phó nhóm</Text></Pressable>
                      <Pressable style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 20, }}
                        onPress={toggleModalDeleteQTV} >
                        <Text style={{ color: "gray", marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Xoá bổ nhiệm phó nhóm</Text></Pressable>
                      <Pressable style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 20, }}
                        onPress={toggleModalMakeAdmin} >
                        <Text style={{ color: "gray", marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Chuyển quyền trưởng nhóm</Text></Pressable>
                    </View>)}
                </View>
              )}
              <Pressable style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 20, }}
                onPress={handleLeaveGroup}>
                {isLoadingLeaveGroup ? (
                  <ActivityIndicator color="black" size="small" />
                ) : (
                  <Text style={{ color: "red", marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>Rời nhóm</Text>
                )}
              </Pressable>
              <Pressable style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 20, }}
                onPress={handleDeleteGroup}>
                {isLoadingRemoveGroup ? (
                  <ActivityIndicator color="black" size="small" />
                ) : (
                  <Text style={{ color: "red", marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>
                    {isGroupAdmin && "Giải tán nhóm"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>)}
      </View>

      <Modal animationType="slide" transparent={true} visible={modalAddMember}>
        <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", }}>
          <View style={{ width: "100%", height: "90%", backgroundColor: "white", alignItems: "center", borderRadius: 10, }}>
            <Toast />
            <View style={{ width: "100%", height: 50, alignItems: "flex-end" }}>
              <Pressable style={{ height: 40, width: 40, justifyContent: "center", alignItems: "center", }}
                onPress={handleHideAddMember}>
                <Ionicons name="close" size={30} color="black" />
              </Pressable>
            </View>
            <View style={{ width: "100%", height: "7%", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 20, justifyContent: "center", }}>
              <Text style={{ fontWeight: "600", fontSize: 20 }}>
                Thêm thành viên
              </Text>
              <Text style={{ color: "#979797", fontWeight: "600" }}>
                Đã chọn: {selectedFriends.length}
              </Text>
            </View>

            <View style={{ flexDirection: "row", width: "85%", height: "7%", alignItems: "center", backgroundColor: "#f5f5f5", paddingHorizontal: 5, }}>
              <Pressable>
                <Ionicons name="search-outline" size={30} color="black" />
              </Pressable>
              <TextInput
                ref={searchInputRef}
                onChangeText={(text) => setTextSearch(text)}
                placeholder="Tìm tên hoặc số điện thoại"
                placeholderTextColor="gray"
                style={{
                  fontSize: 18, height: "80%", width: "80%", paddingHorizontal: 10,
                }}
              ></TextInput>
              <Pressable onPress={() => {
                setTextSearch('');
                setListSearch(listFriendCanSearch);
                if (searchInputRef.current) {
                  searchInputRef.current.clear();
                }
              }}>
                <Ionicons name="close-circle" size={28} color="gray" />
              </Pressable>
            </View>
            <ScrollView style={{ height: "65%", width: "100%" }}>
              {isSearch ? (<View></View>) : (
                listSearch.map((item, index) => renderListItem(item, index))
              )}
            </ScrollView>
            <View style={{ width: "95%", height: "7%", justifyContent: "space-evenly", flexDirection: "row", paddingHorizontal: 10, marginBottom: 10 }}>
              <Pressable style={{ width: "45%", height: "90%", justifyContent: "center", alignItems: "center", backgroundColor: "#FF1744", borderRadius: 10, }}
                onPress={handleHideAddMember}>
                <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>Huỷ</Text>
              </Pressable>
              <Pressable style={{ width: "45%", height: "90%", justifyContent: "center", alignItems: "center", backgroundColor: "#2196F3", borderRadius: 10, }}
                onPress={addMemberToGroup}>
                {isLoadingAddMem ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold' }}>Thêm</Text>
                )}

              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal cập nhật avatar group */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", }}>
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Pressable onPress={openImagePicker}>
              <Image
                source={{ uri: selectedImage }}
                style={{ width: 200, height: 200, borderRadius: 100 }}
              />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
              <Pressable style={{ backgroundColor: '#0091FF', paddingHorizontal: 10, borderRadius: 10, width: 85 }} onPress={closeModal}>
                <Text style={{ color: "white", fontWeight: 'bold', textAlign: "center", paddingVertical: 20 }}>
                  Đóng
                </Text>
              </Pressable>
              <Pressable style={{ backgroundColor: '#0091FF', paddingHorizontal: 10, borderRadius: 10, width: 90, justifyContent: 'center' }} onPress={handleUpdateAvatar}>
                {isLoadingUpdataAvatar ? (
                  <ActivityIndicator color="white" size="large" />
                ) : (
                  <Text style={{ color: "white", fontWeight: 'bold', textAlign: "center", paddingVertical: 20 }} >
                    Cập nhật
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal xác nhận khi xóa thành viên */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalXacNhanXoa}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Bạn có chắc chắn muốn xóa {memberSelected?.profile?.name} khỏi nhóm
            </Text>

            <View style={styles.modalButtonContainer}>
              <Pressable onPress={toggleModal}>
                <Text style={styles.modalButton}>HỦY</Text>
              </Pressable>
              <Pressable onPress={() => { removeMemberInGroup(memberSelected) }}>
                {isLoadingAddMem ? (
                  <ActivityIndicator color="black" size={"small"} />
                ) : (
                  <Text style={styles.modalButton}>XÁC NHẬN</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* Modal thông báo chuyển quyền trưởng nhóm trước khi rời nhóm */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalMakeAdminToOut}
        onRequestClose={() => setIsModalMakeAdminToOut(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Bạn đang là trưởng nhóm. Hãy chuyển quyền trưởng nhóm trước khi rời!
            </Text>
            <Pressable style={{ alignItems: 'center' }} onPress={() => setIsModalMakeAdminToOut(false)}>
              <Text style={styles.modalButton}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    top: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#ccc",
    width: "100%",
    borderColor: "black",
    borderLeftWidth: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  },
  modalButton: {
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#0091FF",
  },
});
export default MessageSettings;