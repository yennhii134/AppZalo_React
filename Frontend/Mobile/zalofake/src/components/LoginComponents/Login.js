import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal
} from "react-native";
import ResetPassword from "../ModalComponents/ResetPassword";
import useAuth from "../../hooks/useAuth";

const Login = ({ }) => {
  const { login, loginCount } = useAuth();
  const [textPhone, setTextPhone] = useState("");
  const [textPW, setTextPW] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalReSetPWVisible, setModalReSetPWVisible] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false)

  const handleLayLaiMatKhau = () => {
    toggleModalLayLaiMatKhau();
    setIsResetPassword(true)
  };
  const toggleModalLayLaiMatKhau = () => {
    setModalReSetPWVisible(!isModalReSetPWVisible);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleTextChange = (input) => {
    setTextPhone(input);
  };

  const handleTextPWChange = (input) => {
    setTextPW(input);
    handleCheckLength(input)
  };

  const handleCheckLength = (text) => {
    if (text.length > 0 && textPhone.length > 0) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }

  const handleForgetPassword = () => {
    setIsResetPassword(!isResetPassword)
  };

  const handleLogin = async () => {
    setIsLoading(true);
    if (loginCount === 5) {
      toggleModalLayLaiMatKhau()
    }

    await login(textPhone, textPW)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {isResetPassword ?
        <ResetPassword
          email={textPhone}
          onClose={(close) => setIsResetPassword(close)}
          onLogin={false}
        />
        :
        <>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              id="phone"
              onChangeText={handleTextChange}
              value={textPhone}
              placeholder="Số điện thoại"
              placeholderTextColor={"gray"}
              style={styles.input}

            />
          </View>
          <View
            style={[
              styles.inputContainer,
              { borderBottomColor: isFocused ? "#64D6EA" : "gray" },
            ]}
          >
            <TextInput
              id="pw"
              secureTextEntry={!showPassword}
              onChangeText={handleTextPWChange}
              value={textPW}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Mật khẩu"
              placeholderTextColor={"gray"}
              style={styles.input}
            />
            <Pressable onPress={toggleShowPassword} style={styles.showHideButton}>
              <Text style={styles.showHide}>{showPassword ? "Ẩn" : "Hiện"}</Text>
            </Pressable>
          </View>
          <Pressable style={styles.forgotPassword} onPress={handleForgetPassword}>
            <Text style={styles.forgotPasswordText}>
              {isResetPassword ? "Huỷ" : "Lấy lại mật khẩu"}
            </Text>
          </Pressable>
          <View style={styles.bottomContainer}>
            <Pressable style={styles.faqButton}>
              <Text style={styles.faq}>Câu hỏi thường gặp</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: isValid ? "#0091FF" : "#BFD3F8" },
              ]}
              disabled={!isValid || isLoading}
              onPress={handleLogin}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Image
                  style={styles.buttonImage}
                  source={require("../../../assets/arrow.png")}
                />
              )}
            </Pressable>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalReSetPWVisible}
            onRequestClose={toggleModalLayLaiMatKhau}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeaderText}>Bạn đã nhập sai mật khẩu quá 5 lần!</Text>
                <Text style={styles.modalText}>
                  Bạn muốn lấy lại mật khẩu không ?
                </Text>

                <View style={styles.modalButtonContainer}>
                  <Pressable onPress={toggleModalLayLaiMatKhau}>
                    <Text style={styles.modalButton}>Không</Text>
                  </Pressable>
                  <Pressable onPress={handleLayLaiMatKhau}>
                    <Text style={styles.modalButton}>Có</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  header: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    marginBottom: 10,
    opacity: 0.5,
  },
  headerText: {
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  inputContainer: {
    marginVertical: 10,
    outlineStyle: "none",
  },
  input: {
    padding: 10,
    fontWeight: "500",
    fontSize: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
  },
  showHideButton: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  showHide: {
    fontWeight: "bold",
    fontSize: 16,
    color: "gray",
  },
  forgotPassword: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0091FF",
    marginLeft: 5
  },
  bottomContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  faqButton: {
    flex: 1,
  },
  faq: {
    fontWeight: "bold",
    color: "gray",
    fontSize: 16,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  modalContainer: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
  },
  modalHeaderText: {
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#0091FF",
  },
});

export default Login;
