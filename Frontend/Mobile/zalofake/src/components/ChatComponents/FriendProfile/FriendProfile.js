import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Modal,
  Switch,
} from "react-native";
import axiosInstance from "../../../api/axiosInstance";
import { Ionicons } from "@expo/vector-icons";
const FriendProfile = ({ navigation, route }) => {
  const { user } = route.params;
  const [isAnNhatKy, setAnNhatKy] = useState(false);
  const anNhatKy = () => setAnNhatKy(!isAnNhatKy);
  const [isChanXem, setChanXem] = useState(false);
  const chanXem = () => setChanXem(!isChanXem);
  const [isModalVisible, setModalVisible] = useState(false);
  
  const fetchFriend = async () => {
    try {
      const response = await axiosInstance.get(`/users/get/uid/${user._id}`);
      navigation.navigate("FriendProfileSettings", { user: response.data.user }  )
      
    } catch (error) {
      console.log(error);
    }
  };

  const PostItem = ({ post }) => (
    <View
      style={{
        marginHorizontal: 20,
        marginVertical: 10,
      }}
    >
      <Text style={{marginVertical: 10, fontWeight: "500"}}>{post.content}</Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {post.image.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={{
              width: 100,
              height: 100,
              paddingStart: 15,
              marginHorizontal: 5,
              marginVertical: 5,
            }}
          />
        ))}
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 15, justifyContent: "space-between" }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 5 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Ionicons
              name="heart"
              size={20}
              color="red"
              style={{ padding: 8 }}
            />
            <Text>{post.likes} người</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 5,
            }}
          >
            <Ionicons
              name="chatbox-ellipses-outline"
              size={20}
              color="black"
              style={{ padding: 8 }}
            />
            <Text style={{ marginEnd: 10 }}>{post.comments} bình luận</Text>
          </View>
        </View>
        <Ionicons
          name="ellipsis-horizontal-sharp"
          size={20}
          color="black"
          style={{ padding: 8 }}
        />
      </View>
    </View>
  );

  const DayItem = ({ day }) => (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          backgroundColor: "gray",
          opacity: 0.42,
          width: 150,
          marginLeft: 20,
          marginVertical: 10,
          textAlign: "center",
          borderRadius: 5,
        }}
      >
        {day.date}
      </Text>
      {day.posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </View>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Pressable>
            <Ionicons
              name="call-outline"
              size={24}
              color="white"
              style={{ padding: 10 }}
            />
          </Pressable>
          <Pressable onPress={() => setModalVisible(!isModalVisible)}>
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ padding: 10 }}
            />
          </Pressable>
          <Pressable
            onPress={() => 
              {
                fetchFriend();
              }
              }
          >
            <Ionicons
              name="ellipsis-horizontal-sharp"
              size={24}
              color="white"
              style={{ padding: 10 }}
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}></View>
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
  }, []);

  const [postData, setPostData] = useState([
    {
      date: "2 tháng 2, 2024",
      posts: [
        {
          content: "Nội dung bài đăng 2",
          image: [
            "https://randomuser.me/api/portraits/men/68.jpg",
            "https://randomuser.me/api/portraits/men/70.jpg",
            "https://randomuser.me/api/portraits/men/72.jpg",
          ],
          likes: 20,
          comments: 8,
        },
        {
          content: "Nội dung bài đăng 5",
          image: ["https://randomuser.me/api/portraits/men/53.jpg"],
          likes: 20,
          comments: 8,
        },
      ],
    },
    {
      date: "1 tháng 2, 2024",
      posts: [
        {
          content: "Nội dung bài đăng 1",
          image: [
            "https://randomuser.me/api/portraits/men/96.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
          ],
          likes: 10,
          comments: 5,
        },
      ],
    },
    {
      date: "12 tháng 12, 2024",
      posts: [
        {
          content: "Nội dung bài đăng 1",
          image: [
            "https://randomuser.me/api/portraits/men/96.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
            "https://randomuser.me/api/portraits/men/68.jpg",
            "https://randomuser.me/api/portraits/men/70.jpg",
            "https://randomuser.me/api/portraits/men/72.jpg",
          ],
          likes: 10,
          comments: 5,
        },
        {
          content: "Nội dung bài đăng 1",
          image: [
            "https://randomuser.me/api/portraits/men/96.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
          ],
          likes: 10,
          comments: 5,
        },
        {
          content: "Nội dung bài đăng 1",
          image: [
            "https://randomuser.me/api/portraits/men/96.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
          ],
          likes: 10,
          comments: 5,
        },
        {
          content: "Nội dung bài đăng 1",
          image: [
            "https://randomuser.me/api/portraits/men/96.jpg",
            "https://randomuser.me/api/portraits/men/55.jpg",
          ],
          likes: 10,
          comments: 5,
        },
      ],
    },
  ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ backgroundColor: "#F4F4F4", height: "100%" }}>
        <Image
          source={{ uri: user.background }}
          style={{ height: 220, width: "100%" }}
          resizeMode="cover"
        />
        <Image
          source={{ uri: user.avatar }}
          style={{
            height: 120,
            width: 120,
            borderRadius: 75,
            borderWidth: 2,
            borderColor: "white",
            marginTop: -70,
            alignSelf: "center",
          }}
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={{ fontSize: 25, paddingStart: 45, fontWeight: "500" }}>
            {user.name}
          </Text>
          <Ionicons
            name="pencil"
            size={18}
            color="black"
            style={{ padding: 8 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Pressable
            style={{
              width: 170,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Ionicons
              name="image"
              size={24}
              color="#005AE0"
              style={{ padding: 10 }}
            />
            <Text>Ảnh 3</Text>
          </Pressable>
          <Pressable
            style={{
              width: 170,
              flexDirection: "row",
              backgroundColor: "white",
              alignItems: "center",
              borderRadius: 15,
            }}
          >
            <Ionicons
              name="videocam"
              size={24}
              color="#0AE046"
              style={{ padding: 10 }}
            />
            <Text>Video</Text>
          </Pressable>
        </View>
        <View style={{ flex: 1, height: "100%" }}>
          {postData.map((day, index) => (
            <DayItem key={index} day={day} />
          ))}
        </View>
      </ScrollView>
      <Pressable
        style={{
          position: "absolute",
          bottom: 16,
          right: 30,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 50,
        }}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={24}
          color="#0091FF"
        />
        <Text style={{ color: "black", marginLeft: 8 }}>Nhắn tin</Text>
      </Pressable>

      {/* <View
        style={{
          position: "absolute",
          bottom: 16,
          right: 30,
          width: "100%",
          height: "100%",
          alignItems: "flex-end",
        }}
      >
        <Pressable
          style={{
            backgroundColor: "white",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            borderRadius: 50,
          }}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={24}
            color="#0091FF"
          />
          <Text style={{ color: "black", marginLeft: 8 }}>Nhắn tin</Text>
        </Pressable>
      </View> */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onPress={() => setModalVisible(!isModalVisible)}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderTopStartRadius: 20,
              borderTopEndRadius: 20,
              width: "100%",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 23,
                fontWeight: "bold",
                marginBottom: 20,
              }}
            >
              Cài đặt riêng tư
            </Text>
            <Pressable
              style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="eye-off-outline"
                  size={27}
                  style={{ marginEnd: 15 }}
                />
                <Text style={{ fontSize: 18 }}>Chặn xem nhật ký của tôi</Text>
                <View style={{ flex: 1 }} />

                <Switch
                  trackColor={{ false: "#767577", true: "#0091FF" }}
                  thumbColor={isChanXem ? "#0091FF" : "#f4f3f4"}
                  onValueChange={chanXem}
                  value={isChanXem}
                  style={{ marginEnd: 15 }}
                />
              </View>
            </Pressable>
            <Pressable
              style={{ height: 50, paddingStart: 22, justifyContent: "center" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Ionicons
                  name="close-circle-outline"
                  size={27}
                  style={{ marginEnd: 15 }}
                />
                <Text style={{ fontSize: 18 }}>Ẩn nhật ký của người này</Text>
                <View style={{ flex: 1 }} />

                <Switch
                  trackColor={{ false: "#767577", true: "#0091FF" }}
                  thumbColor={isAnNhatKy ? "#0091FF" : "#f4f3f4"}
                  onValueChange={anNhatKy}
                  value={isAnNhatKy}
                  style={{ marginEnd: 15 }}
                />
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default FriendProfile;
