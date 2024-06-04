import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, Ionicons } from "react-native-vector-icons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import useLogout from "../../hooks/useLogout";
import Toast from "react-native-toast-message";

const showToastError = (notice) => {
  Toast.show({
    text1: "Sorry !",
    text1Style: { fontSize: 16 },
    text2: notice,
    text2Style: { fontSize: 14 },
    type: "error",
    topOffset: 40,
    position: "top",
  });
};

const PersonalSetting = ({ navigation }) => {
  const logout = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          <Pressable style={{ paddingHorizontal: 2 }}>
            <Ionicons name="search" size={24} color="white" />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Cài đặt
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontSize: 20,
      },
    });
  }, [navigation]);

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout();
    } catch (error) {
      console.log(error);
      showToastError("Lỗi ! Vui lòng thử lại sau");
      setIsLoading(false)
    }
  };

  return (
    <View>
      <ScrollView>
        <Pressable
          onPress={() => {
            navigation.navigate("AccountVsSecurity");
          }}
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#0091FF"
            />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Tài khoản và bảo mật</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Quyền riêng tư */}
        <Pressable
          onPress={() => {
            navigation.navigate("PersonalPrivacy");
          }}
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            marginBottom: 2,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="lock-closed-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Quyền riêng tư</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Dung lượng dữ liệu */}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 80,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="pie-chart-outline" size={24} color="#0091FF" />
          </View>
          <View style={{ width: "70%", height: "75%" }}>
            <Text style={{ fontSize: 16, paddingBottom: 5 }}>
              Dung lượng dữ liệu
            </Text>
            <Text style={{ color: "gray", fontWeight: "medium" }}>
              Quản lý dữ liệu Zalo của bạn
            </Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Bộ nhớ */}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 80,
            marginBottom: 2,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="cloudy-outline" size={24} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Sao lưu và khôi phục</Text>
            <Text style={{ color: "gray", fontWeight: "medium" }}>
              Bảo vệ tin nhắn khi đổi máy hoặc cài lại Zalo
            </Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Thông báo*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <FontAwesomeIcons name="bell" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Thông báo</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Tin nhắn*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="chatbubble-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Tin nhắn</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Cuộc gọi*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="call-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Cuộc gọi</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Nhật ký*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <FontAwesomeIcons name="clock" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Nhật ký</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Danh bạ*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <FontAwesomeIcons name="address-book" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Danh bạ</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Giao diện và ngôn ngữ*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            marginBottom: 2,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="color-palette-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Giao diện và ngôn ngữ</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Thông tin về Zalo*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#0091FF"
            />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Thông tin về Zalo</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable>

        {/* Liên hệ hỗ trợ*/}
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            marginBottom: 2,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="help-circle-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Liên hệ hỗ trợ</Text>
          </View>
          <Pressable
            style={{
              backgroundColor: "#ccc",
              padding: 4,
              borderRadius: 20,
              marginRight: 10,
            }}
            onPress={handleLogout}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="black"
            />
          </Pressable>
        </Pressable>

        {/* Chuyển tài khoản*/}
        {/* <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            height: 60,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <Ionicons name="sync-circle-outline" size={22} color="#0091FF" />
          </View>
          <View style={{ width: "70%" }}>
            <Text style={{ fontSize: 16 }}>Chuyển tài khoản</Text>
          </View>
          <Entypo name="chevron-small-right" size={24} color="#cccccc" />
        </Pressable> */}

        <Pressable
          style={{
            backgroundColor: "#ccc",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: 60,
            width: "90%",
            borderRadius: 20,
            alignSelf: "center",
            marginBottom: 20,
          }}
          onPress={handleLogout}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={{ alignItems: "center", paddingHorizontal: 8 }}>
              <Ionicons name="exit-outline" size={22} color="black" />
            </View>
          )}
          <View style={{ paddingHorizontal: 8 }}>
            <Text style={{ fontSize: 16 }}>Đăng xuất</Text>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default PersonalSetting;
