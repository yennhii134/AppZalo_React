import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  Modal,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { useAuthContext } from "../../contexts/AuthContext";
import axiosInstance from "../../api/axiosInstance";
const PersonalPage = ({ navigation }) => {
  const { authUser, updateAvatar, updateBia } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [modalVisibleBia, setModalVisibleBia] = useState(false);
  const [selectedImageBia, setSelectedImageBia] = useState();
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
          <Pressable style={{ paddingHorizontal: 8 }}>
            <Ionicons name="sync-circle-outline" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("PersonalDetail");
            }}
            style={{ paddingHorizontal: 8 }}
          >
            <Ionicons
              name="ellipsis-horizontal-sharp"
              size={24}
              color="white"
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Trang cá nhân
        </Text>
      ),

      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
    });
  }, [navigation]);

  const openImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage(pickerResult.assets[0].uri);
      setSelectedImageBia(pickerResult.assets[0].uri);
    } else {
      console.log("No image selected");
    }
  };

  const handleUpdateAvatar = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImage,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
      const response = await axiosInstance.post(
        "/users/upload-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseJson = response.request._response;

      // // Phân tích chuỗi JSON thành đối tượng JavaScript
      const responseUrl = JSON.parse(responseJson);
      // Lấy URL của avatar từ đối tượng phân tích
      const avatarUrl = responseUrl.avatar.url;

      if (avatarUrl) {
        setIsLoading(false)
        setSelectedImage(avatarUrl);
        updateAvatar(avatarUrl, responseUrl.avatar.public_id);
        console.log("Success", "Avatar updated successfully");
      } else {
        setIsLoading(false)
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error);
      console.log("Error", error.message || "Failed to update avatar");
    } finally {
      closeModal();
    }
  };

  const openModal = () => {
    setSelectedImage(
      authUser?.profile?.avatar?.url ||
      "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png"
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModalBia = () => {
    setSelectedImageBia(
      authUser?.profile?.background?.url ||
      "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png"
    );
    setModalVisibleBia(true);
  };

  const closeModalBia = () => {
    setModalVisibleBia(false);
  };

  const handleUpdateBia = async () => {
    setIsLoading(true)
    try {
      const formData = new FormData();
      formData.append("background", {
        uri: selectedImageBia,
        type: "image/jpeg",
        name: "background.jpg",
      });
      const response = await axiosInstance.post(
        "/users/upload-background",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseJson = response.request._response;

      // // Phân tích chuỗi JSON thành đối tượng JavaScript
      const responseUrl = JSON.parse(responseJson);
      // Lấy URL của avatar từ đối tượng phân tích
      const backgroundUrl = responseUrl.background.url;

      if (backgroundUrl) {
        setIsLoading(false)
        setSelectedImage(backgroundUrl);
        updateBia(backgroundUrl, responseUrl.background.public_id);
        console.log("Success", "background updated successfully");
      } else {
        setIsLoading(false)
        throw new Error("Failed to update background");
      }
    } catch (error) {
      setIsLoading(false)
      console.error(error);
      console.log("Error", error.message || "Failed to update background");
    } finally {
      closeModalBia();
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#f1f2f6", flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <Pressable
          onPress={openModalBia}
          style={{ width: "100%", height: 200 }}
        >
          <Image
            source={{
              uri:
                authUser?.profile?.background?.url ||
                "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
            }}
            style={{ width: "100%", height: 200 }}
          />
        </Pressable>
        <Pressable onPress={openModal}>
          <Image
            source={{
              uri:
                authUser?.profile?.avatar?.url ||
                "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
            }}
            style={{ width: 96, height: 96, marginTop: -48, borderRadius: 48 }}
          />
        </Pressable>
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 24, marginBottom: 8 }}>
          {authUser.profile?.name}
        </Text>
        <Pressable
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
          onPress={() => { navigation.navigate("PersonalInfo") }}
        >
          <FontAwesomeIcons name="pen" size={14} color="#66a1f0" />
          <Text style={{ color: "#66a1f0", marginLeft: 8 }}>
            Cập nhật giới thiệu bản thân
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <Ionicons name="image" size={26} color="#006af5" />
          <Text style={{ marginLeft: 10 }}>Ảnh của tôi</Text>
          <Text style={{ color: "gray", marginLeft: "auto" }}>2,3K</Text>
        </Pressable>
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <FontAwesomeIcons name="shopping-bag" size={26} color="#12aee3" />
          <Text style={{ marginLeft: 10 }}>Kho khoảnh khắc</Text>
          <Text style={{ color: "gray", marginLeft: "auto" }}>11</Text>
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <TextInput
          value={status}
          onChangeText={setStatus}
          style={{
            backgroundColor: "white",
            flex: 1,
            marginRight: 8,
            padding: 8,
            borderRadius: 8,
          }}
          placeholder="Bạn đang nghĩ gì"
        />
        <Pressable
          style={{
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            borderRadius: 20,
          }}
        >
          <Ionicons name="image" size={26} color="#a4ce50" />
        </Pressable>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 16,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            backgroundColor: "#d4dce2",
            width: 36,
            height: 36,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 18,
          }}
        >
          <Ionicons name="lock-closed" size={16} color="#899097" />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 8 }}>
          <Text style={{ color: "gray", fontWeight: "400" }}>
            Bạn bè của bạn sẽ không xem được các bài đăng dưới đây.{" "}
            <Text style={{ color: "#12aee3", fontWeight: "500" }}>
              Thay đổi cài đặt
            </Text>
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <View
          style={{
            backgroundColor: "#ccc",
            width: "40%",
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "500" }}>13 tháng 5, 2024</Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <View style={{ margin: 8 }}>
            <Text style={{ color: "red", fontWeight: "bold" }}>
              Happy New Year
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 8, marginBottom: 8, }}>
            <Image
              source={require("../../../assets/status-HPNY-1.png")}
              style={{ width: "31%", aspectRatio: 1, marginBottom: 8 }}
            />
            <Image
              source={require("../../../assets/status-HPNY-2.png")}
              style={{ width: "31%", aspectRatio: 1, marginBottom: 8 }}
            />
            <Image
              source={require("../../../assets/status-HPNY-3.png")}
              style={{ width: "31%", aspectRatio: 1, marginBottom: 8 }}
            />
          </View>
          <View style={{ flexDirection: "row", padding: 8 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 24,
              }}
            >
              <Ionicons name="heart-circle-outline" size={26} color="gray" />
              <Text style={{ marginLeft: 4, fontWeight: "500" }}>2</Text>
            </Pressable>
            <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={26}
                color="gray"
              />
              <Text style={{ marginLeft: 4, fontWeight: "500" }}>2</Text>
            </Pressable>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <Pressable>
                <Ionicons name="people" size={22} color="gray" />
              </Pressable>
              <Pressable>
                <Image
                  source={require("../../../assets/ic_threeDots.png")}
                  style={{ width: 18, height: 18, resizeMode: "contain" }}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Code cho status thứ hai */}
      </View>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", }}>
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Pressable onPress={openImagePicker}>
              <Image
                source={{
                  uri:
                    selectedImage ||
                    authUser?.profile?.avatar?.url ||
                    "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                }}
                style={{ width: 200, height: 200, borderRadius: 100 }} />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
              <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={closeModal}>
                <Text style={{ color: "white", fontWeight: 'bold' }}>
                  Đóng
                </Text>
              </Pressable>
              <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={handleUpdateAvatar}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: 'bold' }}>
                    Cập nhật
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* cập nhật ảnh bìa */}
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleBia}
        onRequestClose={closeModalBia}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
            <Pressable onPress={openImagePicker}>
              <Image
                source={{
                  uri:
                    selectedImageBia ||
                    authUser?.profile?.background?.url ||
                    "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                }}
                style={{ width: 200, height: 200, borderRadius: 20 }} />
            </Pressable>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
              <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={closeModalBia}>
                <Text style={{ color: "white", fontWeight: 'bold' }}>
                  Đóng
                </Text>
              </Pressable>
              <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={handleUpdateBia}>
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={{ color: "white", fontWeight: 'bold' }}>
                    Cập nhật
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default PersonalPage;
