import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from "react-native";
import { CheckBox } from "react-native-elements";
import apiConfig from "../../api/config";
import AuthenOTP from "../ModalComponents/AuthenOTP";
import useAuth from "../../hooks/useAuth";

const RegisterInfo = ({ navigation, route }) => {
  const [isCheckedUse, setIsCheckedUse] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalLoginVisible, setModalLoginVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("male");
  const [textPW, setTextPW] = useState("");
  const [textRetypePW, setTextRetypePW] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { name, textPhone, textEmail } = route.params;
  const [checkValid, setCheckValid] = useState(false);
  const { verifyEmailAndRegister } = useAuth();
  const [isError, setIsError] = useState([])
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // xác thực email và tiến hành đăng ký
  const handleSubmitEmail = async () => {
    setIsLoading(true);
    const response = await verifyEmailAndRegister(
      textEmail,
      textPhone,
      name,
      new Date('2000-01-01'),
      selectedGender,
      textPW,
    );
    if (response) {
      toggleModalLogin();
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOtpVerified) {
      handleSubmitEmail()
    }

  }, [isOtpVerified])

  const toggleModalLogin = () => {
    setModalLoginVisible(!isModalLoginVisible);
  };


  const handlePressablePress = () => {
    const newError = []
    if (!/^[A-Za-z\d@$!%*?&#]{6,}$/.test(textPW)) {
      newError.push("length password")
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(textPW)) {
      newError.push("invalid password")
    } else if (!(textPW === textRetypePW)) {
      newError.push("incorrect password")
    } else if (!isCheckedUse) {
      newError.push("check rules")
    }

    if (newError.length > 0) {
      setIsError(newError)
    } else {
      setIsError([])
      setModalVisible(!isModalVisible)
    }
  };

  const checkPwEmpty = (password) => {
    if (password === '') {
      setCheckValid(false)
    } else {
      setCheckValid(true)
    }
  }

  const handleXacNhanLogin = async () => {
    toggleModalLogin();
    await login(textPhone, textPW)
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };
  const handleXacNhanLoginMain = () => {
    toggleModalLogin();
    navigation.navigate("LoginMain");
  };

  const renderError = (error, message) => {
    return (
      isError.map((err, index) => (
        err === error &&
        <View key={index} style={{ padding: 10 }}>
          <Text style={{ color: 'red', fontWeight: '600' }}> {message}</Text>
        </View>
      ))
    )
  }


  return (
    <View style={styles.container}>
      <View style={styles.toastContainer}>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>
          Nhập mật khẩu để tạo tài khoản mới
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          id="pw"
          secureTextEntry={!showPassword}
          onChangeText={(input) => {
            setTextPW(input);
            checkPwEmpty(input)
          }}
          value={textPW}
          placeholder="Mật khẩu"
          placeholderTextColor={"gray"}
          style={styles.input}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.showHideButton}>
          <Text style={styles.showHide}>{showPassword ? "Ẩn" : "Hiện"}</Text>
        </Pressable>
      </View>
      {renderError('length password', 'Mật khẩu phải có ít nhất 6 ký tự')}
      {renderError('invalid password', 'Mật khẩu chứa ít nhất 1 chữ,1 số,1 ký tự đặc biệt')}
      <View style={styles.inputContainer}>
        <TextInput
          id="rtpw"
          secureTextEntry={!showRetypePassword}
          onChangeText={(enteredRetypePw) => {
            setTextRetypePW(enteredRetypePw);
            checkPwEmpty(enteredRetypePw)
          }}
          value={textRetypePW}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor={"gray"}
          style={styles.input}
        />
        <Pressable
          onPress={() => setShowRetypePassword(!showRetypePassword)}
          style={styles.showHideButton}
        >
          <Text style={styles.showHide}>
            {showRetypePassword ? "Ẩn" : "Hiện"}
          </Text>
        </Pressable>
      </View>
      {renderError('incorrect password', 'Vui lòng nhập xác nhận mật khẩu trùng khớp')}
      <View style={styles.checkBoxContainer}>
        <CheckBox
          checked={isCheckedUse}
          onPress={() => setIsCheckedUse(!isCheckedUse)}
          title="Tôi đồng ý với các điều khoản sử dụng Zola"
          containerStyle={styles.checkBox}
          textStyle={styles.checkBoxText}
        />

        <Pressable onPress={() => Linking.openURL(apiConfig.baseURL + "/terms_of_service")}>
          <Text style={{ color: "#0091FF", margin: 20 }}>
            Điều khoản sử dụng Zola ?
          </Text>
        </Pressable>
        {renderError('check rules', 'Vui lòng chấp nhận các điều khoản')}

      </View>
      <Pressable
        style={[
          styles.button,
          checkValid ? styles.validButton : styles.invalidButton
        ]}
        disabled={!checkValid}
        onPress={handlePressablePress}
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

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>
              Xác nhận email: {textEmail}?
            </Text>
            <Text style={styles.modalText}>
              Email này sẽ được sử dụng để gửi mã xác thực
            </Text>
            <View style={styles.modalButtonContainer}>
              <Pressable onPress={toggleModal}>
                <Text style={styles.modalButton}>HỦY</Text>
              </Pressable>
              <Pressable onPress={() => { setModalAuthCode(true); setModalVisible(false) }}>
                {isLoading ? (
                  <ActivityIndicator color="blue" />
                ) : (
                  <Text style={styles.modalButton}>XÁC NHẬN</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal> */}

      {isModalVisible &&
        <AuthenOTP
          textEmail={textEmail}
          onOtpVertified={(verified) => {
            setIsOtpVerified(verified);
          }}
          onIsModalVisible={isModalVisible}
          onCloseModel={(close) => {
            setModalVisible(close)
          }}
        />}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalLoginVisible}
        onRequestClose={toggleModalLogin}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Đăng ký thành công!</Text>
            <Text style={styles.modalText}>
              Bạn muốn về trang chủ hay trang đăng nhập?
            </Text>

            <View style={styles.modalButtonContainer}>
              <Pressable onPress={handleXacNhanLoginMain}>
                <Text style={styles.modalButton}>Trang chủ</Text>
              </Pressable>
              <Pressable onPress={handleXacNhanLogin}>
                {isLoading ? (
                  <ActivityIndicator color="blue" />
                ) : (
                  <Text style={styles.modalButton}>Đăng nhập</Text>
                )}

              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#ddd",
    padding: 10,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    margin: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#64D6EA",

  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
  },
  error: {
    color: "red",
    paddingLeft: 20,
    fontSize: 16,
  },
  checkBoxContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  checkBox: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  checkBoxText: {
    fontWeight: "normal",
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#BFD3F8",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonIcon: {
    width: 40,
    height: 40,
  },
  validButton: {
    backgroundColor: "#0091FF",
  },
  invalidButton: {
    backgroundColor: "#BFD3F8",
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
  toastContainer: {
    zIndex: 99,
  },
  radioRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    // marginVertical: 8,
    paddingRight: 20,
  },

  textGender: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 8,
    paddingRight: 20,
  },
  textGenderOption: {
    fontSize: 15,
    fontWeight: "400",
    marginVertical: 8,
    paddingRight: 20,
  },
  modalContainerAuthCode: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalAuthCode: {
    backgroundColor: "#fff",
    width: "80%",
    height: "70%",
    padding: 10,
    borderRadius: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#333333",
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 5,
  },
  dateButton: {
    width: "78%",
    // borderWidth: 1,
    // borderRadius: 5,
    padding: 10,


  },
  modalContainer1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Màu nền mờ
  },
  modalContent1: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    height: "35%",
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 20,
    alignItems: "flex-end",
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 120,
    width: '70%'
  },
  dateItem: {

    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  TextDateItem: {

    fontSize: 16,
    fontWeight: 'bold'
  },
  selectedItem: {
    backgroundColor: "lightblue", // Màu nền khi được chọn
  },
  confirmButton: {
    display: 'flex',
    width: 100,
    height: 40,
    backgroundColor: 'cyan',
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: 'center',
    margin: 'auto'
  },
  confirmText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default RegisterInfo;
