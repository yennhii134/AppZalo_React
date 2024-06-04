import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";

const PersonalPrivacy = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Quyền riêng tư
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

  return (
    <ScrollView>
      {/* Body */}
      <View>
        {/* Cá nhân */}
        <View style={{ backgroundColor: "white", marginBottom: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontSize: 14,
              color: "#0069fc",
            }}
          >
            Cá nhân
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Sinh nhật
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Ionicons
              name="person-circle-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Hiện trạng thái truy cập
            </Text>
            <Text
              style={{
                fontSize: 12,

                color: "#a5a9aa",
                width: 80,
                textAlign: "right",
              }}
            >
              Đang bật
            </Text>
          </Pressable>
        </View>
        {/* Tin nhắn và cuộc gọi */}
        <View style={{ backgroundColor: "white", marginBottom: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontSize: 14,
              color: "#0069fc",
            }}
          >
            Tin nhắn và cuộc gọi
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color="#a5a9aa"
            ></Ionicons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Hiện trạng thái "Đã xem"
            </Text>
            <Text
              style={{
                fontSize: 12,

                color: "#a5a9aa",
                width: 80,
                textAlign: "right",
              }}
            >
              Đang tắt
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Ionicons
              name="chatbubble-ellipses-sharp"
              size={24}
              color="#a5a9aa"
            ></Ionicons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Cho phép tin nhắn
            </Text>
            <Text
              style={{
                fontSize: 12,

                color: "#a5a9aa",
                width: 80,
                textAlign: "right",
              }}
            >
              Mọi người
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <Ionicons name="call-outline" size={24} color="#a5a9aa"></Ionicons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Cho phép gọi điện
            </Text>
            <Text
              style={{
                fontSize: 12,

                color: "#a5a9aa",
                width: 80,
                textAlign: "right",
              }}
            >
              Bạn bè và người lạ từng liên hệ
            </Text>
          </Pressable>
        </View>
        {/* Nhật ký*/}
        <View style={{ backgroundColor: "white", marginBottom: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontSize: 14,
              color: "#0069fc",
            }}
          >
            Nhật ký
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="pen-square"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Cho phép xem và bình luận
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="ban"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text
              style={{
                flex: 1,
                fontSize: 16,

                paddingLeft: 10,
              }}
            >
              Chặn và ẩn
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>
        {/* Nguồn tìm kiếm và kết bạn*/}
        <View style={{ backgroundColor: "white", marginBottom: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontSize: 14,
              color: "#0069fc",
            }}
          >
            Nguồn tìm kiếm và kết bạn
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="address-book"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <View style={{ flexShrink: 1 }}>
              <Text style={{ fontSize: 16, paddingLeft: 10 }}>
                Tự động kết bạn từ danh bạ máy
              </Text>
              <Text
                style={{
                  fontSize: 12,

                  color: "#a5a9aa",
                  paddingLeft: 10,
                }}
              >
                Thêm liên hệ vào danh bạ Zalo khi cả 2 đều lưu số nhau trên máy
              </Text>
            </View>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="people-arrows"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text
              style={{
                fontSize: 16,

                flex: 1,
                paddingLeft: 10,
              }}
            >
              Quản lý nguồn tìm kiếm và kết bạn
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>
        {/* Quyền của tiện ích và ứng dụng*/}
        <View style={{ backgroundColor: "white", marginBottom: 10 }}>
          <Text
            style={{
              marginLeft: 10,
              paddingTop: 10,
              fontSize: 14,
              color: "#0069fc",
            }}
          >
            Quyền của tiện ích và ứng dụng
          </Text>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="boxes"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text
              style={{
                fontSize: 16,

                flex: 1,
                paddingLeft: 10,
              }}
            >
              Tiện ích
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 10,
              marginTop: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#ccc",
            }}
          >
            <FontAwesomeIcons
              name="border-all"
              size={22}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text
              style={{
                fontSize: 16,

                flex: 1,
                paddingLeft: 10,
              }}
            >
              Ứng dụng
            </Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default PersonalPrivacy;
