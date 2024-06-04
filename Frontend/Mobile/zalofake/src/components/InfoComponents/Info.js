import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { ProgressBar } from "react-native-paper";
import { useAuthContext } from "../../contexts/AuthContext";

const Info = ({ navigation }) => {
  const { authUser } = useAuthContext();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
          <Pressable
            style={{ paddingHorizontal: 2 }}
            onPress={() => navigation.navigate("PersonalSetting")}
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={{ marginLeft: 5, marginRight: 15 }}
          />
          <TextInput
            onFocus={() => {
              navigation.navigate("SearchFriends");
            }}
            style={{
              height: 45,
              width: 200,
              marginLeft: 20,
              fontSize: 16,
            }}
            placeholder="Tìm kiếm"
            placeholderTextColor={"white"}
          />
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
    <View style={styles.container}>
      {/* View Info */}
      <View style={styles.infoContainer}>
        <Pressable
          onPress={() => {
            navigation.navigate("PersonalPage");
          }}
          style={styles.pressableContainer}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri:
                  authUser?.profile?.avatar?.url ||
                  "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
              }}
              style={styles.avatar}
            ></Image>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{authUser.profile?.name}</Text>
            <Text style={styles.viewProfileText}>Xem trang cá nhân</Text>
          </View>
        </Pressable>
        <Pressable>
          <FontAwesomeIcons
            name="exchange-alt"
            size={24}
            color="#0091FF"
            style={{ marginHorizontal: 20, marginVertical: 20 }}
          />
        </Pressable>
      </View>

      {/* View select */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 3,
        }}
      >
        {/* Đăng ký nhạc chờ */}
        <Pressable style={styles.selectContainer}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcons name="music" size={24} color="#0091FF" />
          </View>
          <View style={styles.textContent}>
            <View style={styles.textRow}>
              <Text style={styles.boldText}>Nhạc chờ Zalo</Text>
            </View>
            <Text style={styles.grayText}>
              Đăng ký nhạc chờ, thể hiện cá tính
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesomeIcons name="crown" size={16} color="#e48e04" />
          </View>
        </Pressable>

        {/* Clound */}
        <Pressable style={styles.selectContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="cloudy-outline" size={24} color="#0091FF" />
          </View>
          <View style={styles.textContent}>
            <Text style={styles.boldText}>Clound của tôi</Text>
            <Text style={styles.grayText}>372,2 MB / 1 GB</Text>
            <ProgressBar style={{ height: 2 }} progress={0.5} color="#0091FF" />
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name="arrow-forward" size={24} color="#cccccc" />
          </View>
        </Pressable>
        <View />
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 1,
          }}
        >
          {/* Bộ nhớ */}
          <Pressable style={styles.selectContainer}>
            <View style={styles.iconContainer}>
              <FontAwesomeIcons name="chart-pie" size={24} color="#0091FF" />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.boldText}>Dung lượng và dữ liệu</Text>
              <Text style={styles.grayText}>Quản lý dữ liệu Zalo của bạn</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="arrow-forward" size={24} color="#cccccc" />
            </View>
          </Pressable>

          {/* Tài khoản và bảo mật*/}
          <Pressable
            onPress={() => {
              navigation.navigate("AccountVsSecurity");
            }}
            style={styles.selectContainer}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={22} color="#0091FF" />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.boldText}>Tài khoản và bảo mật</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="arrow-forward" size={24} color="#cccccc" />
            </View>
          </Pressable>

          {/* Quyền riêng tư*/}
          <Pressable
            onPress={() => {
              navigation.navigate("PersonalPrivacy");
            }}
            style={styles.selectContainer}
          >
            <View style={styles.iconContainer}>
              <FontAwesomeIcons name="user-lock" size={22} color="#0091FF" />
            </View>
            <View style={styles.textContent}>
              <Text style={styles.boldText}>Quyền riêng tư</Text>
            </View>
            <View style={styles.iconContainer}>
              <Ionicons name="arrow-forward" size={24} color="#cccccc" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: "row",
    // backgroundColor: "red",
  },
  headerIcon: {
    marginRight: 10,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    marginLeft: 10,
  },
  headerTitleText: {
    color: "gray",
    fontSize: 18,
    marginLeft: 40,
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  pressableContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: "20%",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textContainer: {
    width: "80%",
    marginLeft: 20,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "medium",
  },
  viewProfileText: {
    color: "gray",
    fontWeight: "bold",
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    backgroundColor: "white",
  },
  iconContainer: {
    width: "20%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  textContent: {
    width: "60%",
    marginLeft: 10,
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boldText: {
    fontWeight: "400",
    fontSize: 16,
  },
  grayText: {
    color: "gray",
    fontWeight: "medium",
  },
});

export default Info;
