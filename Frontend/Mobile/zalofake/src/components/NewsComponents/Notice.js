import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";

const Notice = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Pressable>
            <Ionicons
              name="settings-outline"
              size={24}
              color="white"
              style={{ padding: 5, paddingStart: 15 }}
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Thông báo mới</Text>
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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Notice đăng story*/}
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-1.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View style={styles.iconContainer}>
              <FontAwesomeIcons name="video" size={14} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Hoàng Thư{" "}
            <Text style={styles.mediumText}>đăng khoảng khắc mới </Text>
          </Text>
          <Text style={styles.grayText}>18:40 hôm qua</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-3.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#73d593" }]}
            >
              <FontAwesomeIcons name="image" size={18} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Lê Thị Kim Thoa
            <Text style={styles.mediumText}>
              {" "}
              vừa đăng
              <Text style={styles.boldText}> 13 ảnh</Text> mới vào nhật ký sau
              một thời gian
            </Text>
          </Text>
          <Text style={styles.grayText}>18:40 hôm qua</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>

      {/* Notice bình luận ảnh */}
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-4.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#f9964e" }]}
            >
              <Ionicons name="chatbox-ellipses" size={18} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Trần Thị Yến Nhi
            <Text style={styles.mediumText}>
              {" "}
              vừa bình luận bài viết của bạn
            </Text>{" "}
          </Text>
          <Text style={styles.grayText}>2 phút trước</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>

      {/* Notice bày tỏ cảm xúc tym */}
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-4.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#ffd9db" }]}
            >
              <Ionicons name="heart" size={18} color="#dd4248" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Lộc Nguyễn, Bùi Trí Thức
            <Text style={styles.mediumText}>
              {" "}
              bày tỏ cảm xúc với ảnh đại diện của bạn
            </Text>{" "}
          </Text>
          <Text style={styles.grayText}>4/12/2023</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-1.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View style={styles.iconContainer}>
              <FontAwesomeIcons name="video" size={14} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Hoàng Thư{" "}
            <Text style={styles.mediumText}>đăng khoảng khắc mới </Text>
          </Text>
          <Text style={styles.grayText}>18:40 hôm qua</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-3.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#73d593" }]}
            >
              <FontAwesomeIcons name="image" size={18} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Lê Thị Kim Thoa
            <Text style={styles.mediumText}>
              {" "}
              vừa đăng
              <Text style={styles.boldText}> 13 ảnh</Text> mới vào nhật ký sau
              một thời gian
            </Text>
          </Text>
          <Text style={styles.grayText}>18:40 hôm qua</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>

      {/* Notice bình luận ảnh */}
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-4.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#f9964e" }]}
            >
              <Ionicons name="chatbox-ellipses" size={18} color="white" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Trần Thị Yến Nhi
            <Text style={styles.mediumText}>
              {" "}
              vừa bình luận bài viết của bạn
            </Text>{" "}
          </Text>
          <Text style={styles.grayText}>2 phút trước</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>

      {/* Notice bày tỏ cảm xúc tym */}
      <View style={styles.noticeContainer}>
        <Pressable style={styles.pressableContainer}>
          <ImageBackground
            source={require("../../../assets/avata-story-4.png")}
            style={styles.imageBackground}
            resizeMode="contain"
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#ffd9db" }]}
            >
              <Ionicons name="heart" size={18} color="#dd4248" />
            </View>
          </ImageBackground>
        </Pressable>
        <View style={styles.textContainer}>
          <Text style={styles.boldText}>
            Lộc Nguyễn, Bùi Trí Thức
            <Text style={styles.mediumText}>
              {" "}
              bày tỏ cảm xúc với ảnh đại diện của bạn
            </Text>{" "}
          </Text>
          <Text style={styles.grayText}>4/12/2023</Text>
        </View>
        <Pressable style={styles.pressableContainer}>
          <Image
            source={require("../../../assets/ic_threeDots.png")}
            style={styles.imageIcon}
            resizeMode="contain"
          ></Image>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    backgroundColor: "rgb(226,243,251)",
    padding: 10,
  },
  pressableContainer: {
    width: "20%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  iconContainer: {
    backgroundColor: "#9570d9",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  mediumText: {
    fontWeight: "normal",
  },
  grayText: {
    color: "#adcff4",
    fontWeight: "bold",
  },
  imageIcon: {
    width: 16,
    height: 16,
  },
});

export default Notice;
