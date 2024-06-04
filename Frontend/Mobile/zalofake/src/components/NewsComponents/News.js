import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { useAuthContext } from "../../contexts/AuthContext";

const News = ({ navigation }) => {
  const { authUser } = useAuthContext();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="image" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate("Notice")}
            style={styles.headerIcon}
          >
            <FontAwesomeIcons name="bell" size={24} color="white" />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="search"
            size={24}
            color="white"
            style={{ marginLeft: 5, marginRight: 25 }}
          />
          <TextInput
            onFocus={() => {
              navigation.navigate("SearchFriends");
            }}
            style={{
              height: 45,
              width: 300,
              marginLeft: 25,
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
    <ScrollView style={styles.container}>
      {/* Đăng status */}
      <View style={styles.statusContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                authUser?.profile?.avatar?.url ||
                "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
            }}
            style={styles.avatar}
          />

          <Pressable
            style={styles.statusTextContainer}
            onPress={() => {
              navigation.navigate("PostStatus");
            }}
          >
            <Text style={styles.statusText}>Bạn đang nghĩ gì?</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.button}>
            <Ionicons name="image" size={20} color="#56ce83" />
            <Text style={styles.buttonText}>Ảnh</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Ionicons name="videocam" size={20} color="#df34be" />
            <Text style={styles.buttonText}>Video</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Ionicons name="albums" size={20} color="#0a6bf4" />
            <Text style={styles.buttonText}>Album</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <FontAwesomeIcons name="clock" size={20} color="#e67627" />
            <Text style={styles.buttonText}>Kỷ niệm</Text>
          </Pressable>
        </View>
      </View>

      {/* List story */}
      <View style={styles.storyContainer}>
        <Text style={styles.storyTitle}>Khoảng khắc</Text>
        <View style={styles.storyList}>
          <Pressable>
            <ImageBackground
              source={require("../../../assets/story_1.png")}
              style={styles.storyItem}
            >
              <Pressable style={styles.storyIconContainer}>
                <FontAwesomeIcons name="pen" size={10} color="white" />
              </Pressable>
              <Text style={styles.storyName}>Tạo mới</Text>
            </ImageBackground>
          </Pressable>
          <Pressable
            style={{
              borderWidth: 0.5,
              borderRadius: 10,
              padding: 3,
              marginHorizontal: 5,
            }}
          >
            <ImageBackground
              source={require("../../../assets/status-HPNY-2.png")}
              style={styles.storyItem}
            >
              {/* <Pressable style={styles.storyIconContainer}>
                <FontAwesomeIcons name="pen" size={10} color="white" />
              </Pressable>
              <Text style={styles.storyName}>Tạo mới</Text> */}
            </ImageBackground>
          </Pressable>
          <Pressable
            style={{
              borderWidth: 0.5,
              borderRadius: 10,
              padding: 3,
              marginHorizontal: 5,
            }}
          >
            <ImageBackground
              source={require("../../../assets/status-HPNY-3.png")}
              style={styles.storyItem}
            >
              {/* <Pressable style={styles.storyIconContainer}>
                <FontAwesomeIcons name="pen" size={10} color="white" />
              </Pressable>
              <Text style={styles.storyName}>Tạo mới</Text> */}
            </ImageBackground>
          </Pressable>
        </View>
      </View>

      {/* List status */}
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <View style={styles.statusHeader}>
            <Pressable>
              <Image
                source={require("../../../assets/avata-story-1.png")}
                style={styles.statusAvatar}
              />
            </Pressable>
            <View style={styles.statusInfo}>
              <Pressable>
                <Text style={styles.statusName}>Thuỳ Linh</Text>
              </Pressable>
              <Text style={styles.statusTime}>9 phút trước</Text>
            </View>
            <Pressable style={styles.statusOptions}>
              <Image
                source={require("../../../assets/ic_threeDots.png")}
                style={styles.statusOptionsIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusText}>
              Khi bạn chọn bình yên, nó đi kèm với rất nhiều lời tạm biệt
            </Text>
          </View>
          <View style={styles.statusImageContainer}>
            <Image
              source={require("../../../assets/status-1.png")}
              style={styles.statusImage}
            />
          </View>
          <View style={styles.statusActions}>
            <View style={styles.statusLike}>
              <Pressable style={styles.statusLikeText}>
                <Ionicons name="heart" size={22} color="#ef243a" />
                <Text style={{ marginLeft: 5 }}>
                  Trần Hằng và 15 người khác
                </Text>
              </Pressable>
              <Text style={styles.statusCommentText}>1 bình luận</Text>
            </View>
            <View style={styles.statusButtons}>
              <Pressable style={styles.statusButton}>
                <Ionicons name="heart-outline" size={22} color="black" />
                <Text style={styles.statusButtonText}>Thích</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.statusButton,
                  { marginLeft: 20, paddingHorizontal: 10 },
                ]}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={22}
                  color="black"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDE6ED",
  },
  headerRightContainer: {
    flexDirection: "row",
  },
  headerIcon: {
    padding: 10,
    marginLeft: 15,
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
  statusContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    margin: 10,
    width: 64,
    height: 64,
  },

  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonText: {
    fontWeight: "600",
    marginLeft: 8,
  },
  storyContainer: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  storyTitle: {
    fontWeight: "600",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  storyList: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  storyItem: {
    width: 90,
    height: 130,
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: 10,
  },
  storyIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#169dff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  storyName: {
    fontWeight: "600",
    color: "white",
    fontSize: 12,
  },
  statusContainer: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  statusInfo: {
    flex: 1,
  },
  statusName: {
    fontWeight: "bold",
  },
  statusTime: {
    fontSize: 12,
    color: "gray",
  },
  statusOptions: {
    width: 40,
    alignItems: "center",
  },
  statusOptionsIcon: {
    width: 15,
    height: 15,
  },
  statusContent: {
    marginTop: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "400",
  },
  statusImageContainer: {
    width: "100%",
    height: 200,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statusImage: {
    width: "100%",
    height: "100%",
  },
  statusActions: {
    marginTop: 10,
  },
  statusLike: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLikeText: {
    flexDirection: "row",
    marginLeft: 5,
  },
  statusCommentText: {
    marginRight: 10,
  },
  statusButtons: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    marginTop: 5,
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    padding: 5,
  },
  statusButtonText: {
    marginLeft: 5,
    marginRight: 20,
  },
});

export default News;
