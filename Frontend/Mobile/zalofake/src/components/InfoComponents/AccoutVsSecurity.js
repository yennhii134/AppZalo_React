import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { Switch } from "react-native-paper";

// CSS styles

const AccountVsSecurity = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
            Tài khoản và bảo mật
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

  return (
    <View>
      {/* Body */}
      <View>
        {/* Tài khoản */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <Pressable style={styles.listItemContainer}>
            <Ionicons name="call-outline" size={26} color="#a5a9aa"></Ionicons>
            <Text style={styles.listItemText}>Số điện thoại</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable style={styles.listItemContainer}>
            <FontAwesomeIcons
              name="user-check"
              size={26}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text style={styles.listItemText}>Định danh tài khoản</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable style={styles.listItemContainer}>
            <Ionicons
              name="qr-code-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text style={styles.listItemText}>Mã QR của tôi</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>

        {/* Bảo mật */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Bảo mật</Text>
          <Pressable style={styles.listItemContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text style={styles.listItemText}>Kiểm tra bảo mật</Text>
            <Ionicons name="warning" size={22} color="#f7c001"></Ionicons>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable style={styles.listItemContainer}>
            <FontAwesomeIcons
              name="user-lock"
              size={26}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text style={styles.listItemText}>Khoá Zalo</Text>
            <Text style={styles.listItemSubText}>Đang tắt</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>

        {/* Đăng nhập */}
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Đăng nhập</Text>
          <Pressable style={styles.listItemContainer}>
            <FontAwesomeIcons
              name="shield-virus"
              size={26}
              color="#a5a9aa"
            ></FontAwesomeIcons>
            <Text style={styles.listItemText}>Bảo mật 2 lớp</Text>
            <Switch value={true} color="#0091FF" />
          </Pressable>
          <Pressable style={styles.listItemContainer}>
            <Ionicons
              name="phone-portrait-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text style={styles.listItemText}>Thiết bị đăng nhập</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
          <Pressable style={styles.listItemContainer} onPress={() => {navigation.navigate("ChangePassword")}}>
            <Ionicons
              name="lock-closed-outline"
              size={26}
              color="#a5a9aa"
            ></Ionicons>
            <Text style={styles.listItemText}>Mật khẩu</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>

        {/* Xoá tài khoản */}
        <View style={styles.container}>
          <Pressable
            style={[styles.listItemContainer, { backgroundColor: "white" }]}
          >
            <Text style={styles.listItemText}>Xoá tài khoản</Text>
            <Ionicons name="arrow-forward" size={22} color="#a5a9aa"></Ionicons>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AccountVsSecurity;

const styles = {
  container: {
    backgroundColor: "white",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    marginLeft: 10,
    paddingTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#0069fc",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
  listItemSubText: {
    fontSize: 12,
    color: "#a5a9aa",
    width: 80,
    textAlign: "right",
  },
};
