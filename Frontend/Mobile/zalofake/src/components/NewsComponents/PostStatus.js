import { View, Text, Switch, Pressable, Image, StyleSheet, FlatList, ScrollView } from "react-native";
import { React, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";

const PostStatus = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#0eaaff", true: "#81b0ff" }}
            thumbColor={"white"}
            ios_backgroundColor="#3e3e3e"
          />
          <Pressable>
            <Text style={styles.headerText}>Đăng</Text>
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <View style={{ alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="people"
              size={20}
              color="#828282"
              style={{ paddingHorizontal: 4 }}
            />
            <Text style={styles.headerText}>Tất cả bạn bè</Text>
            <Pressable style={{ paddingBottom: 2, paddingHorizontal: 4 }}>
              <FontAwesomeIcons name="sort-down" size={20} color="black" />
            </Pressable>
          </View>
          <Text style={styles.subHeaderText}>Xem bởi bạn bè trên Zalo</Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#FFFFFF",
      },
      headerTintColor: "black",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation]);

  const [selectedImages, setSelectedImages] = useState([]);

  // Hàm xử lý khi chọn ảnh
  const handleSelectImage = (imageUri) => {
    // Kiểm tra xem ảnh đã được chọn chưa
    const index = selectedImages.findIndex((img) => img === imageUri);
    if (index === -1) {
      // Nếu chưa được chọn thì thêm vào danh sách
      setSelectedImages([...selectedImages, imageUri]);
    } else {
      // Nếu đã được chọn thì loại bỏ khỏi danh sách
      const updatedImages = [...selectedImages];
      updatedImages.splice(index, 1);
      setSelectedImages(updatedImages);
    }
  };

  return (
    <View style={styles.bodyContainer}>
      <View style={styles.statusInputContainer}>
        <Text style={styles.statusInputLabel}>Bạn đang nghĩ gì?</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button}>
          <FontAwesomeIcons name="music" size={18} color="black" />
          <Text style={styles.buttonText}>Nhạc</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Ionicons name="albums" size={18} color="black" />
          <Text style={styles.buttonText}>Album</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <FontAwesomeIcons name="tag" size={18} color="black" />
          <Text style={styles.buttonText}>Với bạn bè</Text>
        </Pressable>
      </View>
      <View style={styles.imageContainer}>
        <View style={{ width: "100%", height: "30%", borderWidth: 1 }}>
          
          <FlatList
          data={selectedImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSelectImage(item)}>
              <Image
                source={{ uri: item }}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 8,
                  marginBottom: 8,
                }}
              />
            </Pressable>
          )}
          />
        </View>
        <View style={styles.iconContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Pressable>
              <FontAwesomeIcons
                name="image"
                size={24}
                color="#1294fd"
                style={styles.icon}
              />
            </Pressable>
            <Pressable>
              <FontAwesomeIcons
                name="video"
                size={24}
                color="#9C9C9C"
                style={styles.icon}
              />
            </Pressable>
            <Pressable>
              <Ionicons
                name="location"
                size={24}
                color="#9C9C9C"
                style={styles.icon}
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.imageGrid}>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.imageItem}>
            <Image
              source={require("../../../assets/story_1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default PostStatus;

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  switch: {
    marginHorizontal: 4,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subHeaderText: {
    color: "#828282",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  bodyContainer: {
    backgroundColor: "#FFFFFF",
    height: "100vh",
  },
  statusInputContainer: {
    padding: 16,
  },
  statusInputLabel: {
    color: "#828282",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginLeft: 25,
  },
  imageContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    overflow: "scroll",
  },
  imageItem: {
    width: "30%",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
