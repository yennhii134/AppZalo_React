import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

const LoginMain = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <Text style={styles.title}>Zalo</Text>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require("../../../assets/bgLogin.png")}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.boldText}>Gọi video ổn định</Text>
        <Text style={styles.normalText}>
          Trò chuyện thật đã  mọi lúc mọi nơi
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <Pressable style={[styles.icon, styles.activeIcon]} />
        <Pressable style={styles.icon} />
        <Pressable style={styles.icon} />
        <Pressable style={styles.icon} />
        <Pressable style={styles.icon} />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("RegisterName")}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            ĐĂNG KÝ
          </Text>
        </Pressable>
      </View>
      <View style={styles.languageContainer}>
        <Pressable style={styles.languageButton}>
          <Text style={[styles.languageText, styles.activeLanguage]}>
            Tiếng Việt
          </Text>
        </Pressable>
        <Pressable style={styles.languageButton}>
          <Text style={styles.languageText}>English</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#0091FF",
    marginBottom: 20,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  textContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  normalText: {
    fontSize: 14,
    textAlign: "center",
    color: "#808080",
  },
  iconContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  icon: {
    width: 10,
    height: 10,
    borderRadius: 15,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 5,
  },
  activeIcon: {
    backgroundColor: "#0091FF",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0091FF",
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#808080",
  },
  secondaryButtonText: {
    color: "#808080",
  },
  languageContainer: {
    flexDirection: "row",
  },
  languageButton: {
    padding: 10,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#808080",
  },
  activeLanguage: {
    color: "#0091FF",
    borderBottomColor: "#0091FF",
    borderBottomWidth: 1,
  },
});

export default LoginMain;
