import { View, Text, Image, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Switch } from "react-native";
import moment from 'moment-timezone';
const FriendProfileSettings = ({ navigation, route }) => {
  const { user } = route.params;
  const [isFavorite, setFavorite] = useState(false);

  const [isNotification, setNotification] = useState(true);

  const [isBlockJournal, setBlockJournal] = useState(true);

  const [isHideJournal, setHideJournal] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  navigation.setOptions({
    headerTitle: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 25, paddingStart: 45, fontWeight: "500", color: 'white' }}>{user.profile.name}</Text>
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
  
  return (
    <View style={{ flex: 1, backgroundColor: "#E5E9EB" }}>
      <View style={{ backgroundColor: "white" }}>
        <Pressable
          style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
          onPress={() => setModalVisible(!isModalVisible)}
        >
          <Text style={{ fontSize: 18 }}>Thông tin</Text>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            marginLeft: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
        <Pressable
          style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18 }}>Đổi tên gợi nhớ</Text>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            marginLeft: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
        <Pressable
          style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 18 }}>Đánh dấu bạn thân</Text>
            <View style={{ flex: 1 }} />

            <Switch
              trackColor={{ false: "#767577", true: "#0091FF" }}
              thumbColor={isFavorite ? "#0091FF" : "#f4f3f4"}
              onValueChange={() => setFavorite(!isFavorite)}
              value={isFavorite}
              style={{ marginEnd: 15 }}
            />
          </View>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            marginLeft: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
        <Pressable
          style={{
            height: 50,
            backgroundColor: "white",
            paddingStart: 22,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 18 }}>Giới thiệu cho bạn bè</Text>
        </Pressable>
      </View>
      <Pressable
        style={{
          height: 80,
          backgroundColor: "white",
          paddingStart: 22,
          justifyContent: "center",
          marginTop: 10,
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 18, color: "#0091FF" }}>
          Thông báo
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 18 }}>
            Nhận thông báo về hoạt động của người này
          </Text>
          <View style={{ flex: 1 }} />

          <Switch
            trackColor={{ false: "#767577", true: "#0091FF" }}
            thumbColor={isNotification ? "#0091FF" : "#f4f3f4"}
            onValueChange={() => setNotification(!isNotification)}
            value={isNotification}
            style={{ marginEnd: 15 }}
          />
        </View>
      </Pressable>
      <View
        style={{
          height: 130,
          backgroundColor: "white",
          paddingStart: 22,
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <Text style={{ fontWeight: "600", fontSize: 18, color: "#0091FF" }}>
          Cài đặt riêng tư
        </Text>
        <Pressable style={{ height: 50, justifyContent: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 18 }}>Chặn xem nhật ký của tôi</Text>
            <View style={{ flex: 1 }} />
            <Switch
              trackColor={{ false: "#767577", true: "#0091FF" }}
              thumbColor={isBlockJournal ? "#0091FF" : "#f4f3f4"}
              onValueChange={() => setBlockJournal(!isBlockJournal)}
              value={isBlockJournal}
              style={{ marginEnd: 15 }}
            />
          </View>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            paddingStart: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
        <Pressable style={{ height: 50, justifyContent: "center" }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 18 }}>Ẩn nhật ký của người này</Text>
            <View style={{ flex: 1 }} />
            <Switch
              trackColor={{ false: "#767577", true: "#0091FF" }}
              thumbColor={isHideJournal ? "#0091FF" : "#f4f3f4"}
              onValueChange={() => setHideJournal(!isHideJournal)}
              value={isHideJournal}
              style={{ marginEnd: 15 }}
            />
          </View>
        </Pressable>
      </View>
      <View
        style={{ height: 1, marginLeft: 20, marginRight: 10, opacity: 0.2 }}
      />
      <View style={{ flex: 1, backgroundColor: "white", marginTop: 10 }}>
        <Pressable
          style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18 }}>Báo xấu</Text>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            marginLeft: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
        <Pressable
          style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, color: "red" }}>Xóa bạn</Text>
        </Pressable>
        <View
          style={{
            height: 1,
            backgroundColor: "gray",
            marginLeft: 20,
            marginEnd: 10,
            opacity: 0.2,
          }}
        />
      </View>
      {/* Modal xem thông tin  */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={() => setModalVisible(!isModalVisible)}
        >
          <View>
            <Image
              source={{
                uri:
                  user?.profile?.background?.url ||
                  "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
              }}
              style={{ width: "100%", height: 250 }}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: -100,
                alignItems: "left",
                paddingBottom: 10,
                paddingLeft: 10,
              }}
            >
              <Pressable onPress={() => setModalVisible(true)}>
                <Image
                  source={{
                    uri:
                      user?.profile?.avatar?.url ||
                      "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                  }}
                  style={{ width: 75, height: 75, borderRadius: 48 }}
                />
              </Pressable>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: 20,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                  {user?.profile?.name}
                </Text>
              </View>
            </View>
            <View
              style={{ backgroundColor: "#fff", paddingTop: 15, paddingLeft: 10 }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "500", paddingBottom: 10 }}
              >
                Thông tin cá nhân
              </Text>
              <View>
                
                <View  style={{display:'flex', flexDirection:'row'}}
                >
                  <Text style={{ width: "30%", fontSize: 16, fontWeight: "400" }}>
                  Giới tính
                </Text>
                  {user?.profile?.gender === 'male' ? (
                    <Text>Nam</Text>
                  ) : (
                    <View>
                      {
                        user?.profile?.gender === 'female' ? (<Text>Nữ</Text>) : (<Text>Khác</Text>)
                      }</View>
                  )
                  }


                </View>

                
                <View
                  style={{
                    height: 50,
                    paddingTop: 15,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ width: "30%", fontSize: 16, fontWeight: "400" }}>
                  Ngày sinh
                </Text>
                  <Text>{moment(user?.profile?.dob).format("DD/MM/YYYY")}</Text>
                </View>
                <View
                  style={{
                    height: 100,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ width: "30%", fontSize: 16, fontWeight: "400" }}>
                    Điện thoại
                  </Text>
                  <View
                    style={{
                      width: "67%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Text>
                      +84 {user?.phone.substring(1)}
                    </Text>
                  </View>
                </View>

              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default FriendProfileSettings;
