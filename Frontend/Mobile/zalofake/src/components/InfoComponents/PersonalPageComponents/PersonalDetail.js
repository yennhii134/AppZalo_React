import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../contexts/AuthContext";
import ModalUpdateImageProfile from "./ModalUpdateImageProfile";

const PersonalDetail = ({ navigation }) => {
  const { authUser } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("")

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            {authUser.profile?.name}
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation]);

  const openModalUpdateImage = (typeUpload) => {
    setType(typeUpload)
    setModalVisible(true)
  }
  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      {/* Body */}
      <View>
        <Pressable
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
          onPress={() => {
            navigation.navigate("PersonalInfo");
          }}
        >
          <Text style={{ fontSize: 16 }}>Thông tin</Text>
        </Pressable>
        <Pressable
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Cập nhật giới thiệu bản thân</Text>
        </Pressable>
        <Pressable
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Ví của tôi</Text>
        </Pressable>
        <Pressable
          onPress={() => openModalUpdateImage("Avatar")}
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Đổi ảnh đại diện</Text>
        </Pressable>
        <Pressable
          onPress={() => openModalUpdateImage("Background")}
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Đổi ảnh bìa</Text>
        </Pressable>
        {
          modalVisible &&
          <ModalUpdateImageProfile
            onOpen={modalVisible}
            type={type}
            isUpdate={true}
            onClose={(close) => setModalVisible(close)}
            renderImage={null}
          />
        }
      </View>
      <View
        style={{ backgroundColor: "#f0f0f0", height: 2, width: "100%" }}
      ></View>
      {/* Setting */}
      <View>
        <Text
          style={{
            marginLeft: 2,
            paddingHorizontal: 20,
            marginTop: 20,
            fontSize: 16,
            color: "#4b91c8",
            fontWeight: "bold",
          }}
        >
          Cài đặt
        </Text>
        <Pressable
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Mã QR của tôi</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("PersonalPrivacy");
          }}
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Quyền riêng tư</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            navigation.navigate("AccountVsSecurity");
          }}
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Quản lý tài khoản</Text>
        </Pressable>
        <Pressable
          style={{
            marginLeft: 2,
            marginTop: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
          }}
        >
          <Text style={{ fontSize: 16 }}>Cài đặt chung</Text>
        </Pressable>
      </View>

    </View>
  );
};

export default PersonalDetail;
