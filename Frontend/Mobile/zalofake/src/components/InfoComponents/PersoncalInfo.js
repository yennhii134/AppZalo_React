import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import OTPTextView from "react-native-otp-textinput";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { useAuthContext } from "../../contexts/AuthContext";
import RadioButton from "react-native-radio-buttons-group";
import useUpdate from "../../hooks/useUpdate";
import useRegister from "../../hooks/useRegister";
const PersonalInfo = ({ navigation }) => {
  const { authUser } = useAuthContext();
  const [originalProfile, setOriginalProfile] = useState({});
  const [usDob, setUsDob] = useState(new Date(authUser?.profile.dob));
  const [usGender, setUsGender] = useState(authUser?.profile.gender);
  const [usName, setUsName] = useState(authUser?.profile?.name);
  const [usEmail, setUsEmail] = useState(authUser?.email);
  const { updateProfile } = useUpdate();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const [otp, setOtp] = useState("");
  const [isPreSendCode, setIsPreSendCode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalAuthCode, setModalAuthCode] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const { showToastError, showToastSuccess, getOTP, verifyOTP, GetSystemOTP } =
    useRegister();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setOriginalProfile({
      name: authUser?.profile?.name,
      email: authUser?.email,
      gender: authUser?.profile?.gender,
      dob: new Date(authUser?.profile?.dob),
    });
  }, []);

  const handleNameChange = (text) => {
    setUsName(text);
  };

  const handleEmailChange = (text) => {
    setUsEmail(text);
  };

  // tiến hành gửi mã otp, nếu đã gửi sẽ hiển thị modal cho nhập email
  const pressSendOTP = async (e) => {
    const systemOTP = await getOTP(usEmail);
    if (systemOTP) {
      toggleModal();
      setIsLoading(false);
      handlesendAuthCode();
    } else {
      toggleModal();
      setIsLoading(false);
    }
  };

  // tiến hành gửi lại mã otp, nếu đã gửi sẽ hiển thị modal cho nhập email
  const pressPreSendOTP = async (e) => {
    setIsLoading(true);
    const systemOTP = await getOTP(usEmail);
    if (systemOTP) {
      setIsLoading(false);
      setTimeLeft(60);
      SendTime();
      setIsPreSendCode(false);
      setIsCounting(true);
    }
  };
  // xác thực email và tiến hành đăng ký
  const handleSubmitEmail = async (e) => {
    console.log(GetSystemOTP());
    console.log(otp);
    const verified = await verifyOTP(otp, GetSystemOTP());
    if (verified) {
      Toast.show({
        type: "error",
        text1: "OK",
        text1Style: { color: "green" },
      });
      // await updateProfile(usName, usEmail, usGender, selectedDate);
      handleUpdateProfileNew();
      // handleUpdateProfile();
      toggleModalAuthCode();
    } else {
      Toast.show("Invalid OTP");
      console.log("Invalid OTP");
    }
  };
  // button khi nhấn vào xác nhận emai để gửi email
  const handleXacNhan = async () => {
    setIsLoading(true);
    pressSendOTP();
  };

  const handlesendAuthCode = async (e) => {
    toggleModalAuthCode();
    setTimeLeft(60);
    setIsPreSendCode(false);
    SendTime();
  };

  const handleOTPChange = (enteredOtp) => {
    setOtp(enteredOtp);
  };
  // kiểm tra otp có đầy đủ không
  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      handleSubmitEmail();
    } else {
      showToastError("Hãy nhập đủ mã xác thực");
    }
  };

  // đếm thời gian giảm dần
  useEffect(() => {
    let timer;
    if (isCounting && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsPreSendCode(true);
      clearInterval(timer);
      setIsCounting(false);
    }

    // Xóa interval khi component bị unmount
    return () => clearInterval(timer);
  }, [isCounting, timeLeft]);

  const SendTime = () => {
    setIsCounting(true);
  };

  useEffect(() => {
    if (timeLeft === 0) {
      return;
    }
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    setIsLoading(false);
  };
  const toggleModalAuthCode = () => {
    setModalAuthCode(!isModalAuthCode);
  };

  const getChangedFields = () => {
    const changedFields = {};

    if (usName !== originalProfile.name) {
      changedFields.name = usName;
    }
    if (usEmail !== originalProfile.email) {
      changedFields.email = usEmail;
    }
    if (usGender !== originalProfile.gender) {
      changedFields.gender = usGender;
    }
    if (usDob.getTime() !== originalProfile.dob.getTime()) {
      changedFields.dob = usDob;
    }

    return changedFields;
  };
  const handleUpdateProfile = async () => {
    if (!validateData()) {
      return;
    }
    const changedFields = getChangedFields();
    if (Object.keys(changedFields).length === 0) {
      // Không có trường nào thay đổi
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Không có thông tin nào thay đổi",
        text1Style: { color: "red" },
        text2Style: { color: "red" },
      });
      return;
    }
    if (usEmail === authUser?.email) {
      handleUpdateProfileNew();
    } else {
      toggleModal();
    }
  };
  const handleUpdateProfileNew = async () => {
    try {
      const selectedDay = usDob.getDate();
      const selectedMonth = usDob.getMonth();
      const selectedYear = usDob.getFullYear();

      const selectedDate = new Date(selectedYear, selectedMonth, selectedDay);

      await updateProfile(usName, usEmail, usGender, selectedDate);
      setIsModalSuccess(true)
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const validateData = () => {
    // Kiểm tra xem tất cả các trường đều được nhập
    if (!usName || !usEmail || !usGender || !usDob) {
      Toast.show({
        type: "error",
        text1: "Vui lòng nhập đầy đủ thông tin !",
        text1Style: { color: "red" },
      });
      return false;
    }

    // Kiểm tra định dạng email
    if (!usEmail.trim().toLowerCase().endsWith("@gmail.com")) {
      Toast.show({
        type: "error",
        text1: "Email phải có định dạng @gmail.com",
        text1Style: { color: "red" },
      });
      return false;
    }

    if (new Date().getFullYear() - usDob.getFullYear() < 16) {
      Toast.show({
        type: "error",
        text1: "Phải trên 16 tuổi",
        text1Style: { color: "red" },
      });
      return false;
    }
    return true;
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingHorizontal: 5 }}>
          <Pressable style={{ paddingHorizontal: 8 }}>
            <Ionicons name="sync-circle-outline" size={24} color="white" />
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate("PersonalDetail");
            }}
            style={{ paddingHorizontal: 8 }}
          >
            <Ionicons
              name="ellipsis-horizontal-sharp"
              size={24}
              color="white"
            />
          </Pressable>
        </View>
      ),
      headerTitle: () => (
        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Thông tin cá nhân
        </Text>
      ),

      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "#fff",
      },
    });
  }, [navigation]);


  const radioButtons = useMemo(
    () => [
      {
        id: "male",
        label: "Nam",
        value: "male",
        color: "blue",
        size: 24,
      },
      {
        id: "female",
        label: "Nữ",
        value: "female",
        color: "blue",
        size: 24,
      },
      {
        id: "other",
        label: "Khác",
        value: "other",
        color: "blue",
        size: 24,
      },
    ],
    []
  );




  return (
    <View style={{ backgroundColor: "#EFEFEF", flex: 1 }}>
      <ScrollView>
        <View>
          {/* <Image
            source={{
              uri:
                authUser?.profile?.background?.url ||
                "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
            }}
            style={{ width: "100%", height: 250 }}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: -100,
              alignItems: "left",
              paddingBottom: 10,
              paddingLeft: 10,
            }}
          >
            <Pressable onPress={() => setModalVisible(true)}>
              <Image
                source={{
                  uri:
                    authUser?.profile?.avatar?.url ||
                    "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                }}
                style={{ width: 75, height: 75, borderRadius: 48 }}
              />
            </Pressable>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 20,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
                {authUser?.profile?.name}
              </Text>
            </View>
          </View> */}
          <View
            style={{ backgroundColor: "#fff", paddingTop: 15, paddingLeft: 10 }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 10 }}
            >
              Thông tin cá nhân
            </Text>
            <View>
              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500" }}>
                Tên hiển thị:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  height: 60,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBlockColor: "#e0e3e5",
                }}
              >
                <TextInput
                  style={{ fontSize: 18, width: 370, color: 'gray', fontWeight: 'bold' }}
                  defaultValue={usName}
                  onChangeText={handleNameChange}
                />
              </View>
              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500" }}>
                Email hiển thị:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  height: 60,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBlockColor: "#e0e3e5",
                }}
              >
                <TextInput
                  style={{ fontSize: 18, width: 370, color: 'gray', fontWeight: 'bold' }}
                  defaultValue={usEmail}
                  onChangeText={handleEmailChange}
                />
              </View>

              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500" }}>
                Giới tính
              </Text>
              <View
                style={{
                  height: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#bbb",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <RadioButton
                    radioButtons={radioButtons}
                    onPress={(value) => setUsGender(value)}
                    selectedId={usGender}
                    layout="row"
                    labelStyle={{ fontSize: 18 }}
                  />
                </View>
              </View>

              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500" }}>
                Ngày sinh
              </Text>
              <View
                style={{
                  height: 50,
                  paddingTop: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: "#bbb",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    borderBlockColor: "#e0e3e5",
                  }}
                >
                  <Picker
                    selectedValue={usDob.getFullYear()}
                    onValueChange={(itemValue, itemIndex) => {
                      const isLeapYear =
                        (itemValue % 4 === 0 && itemValue % 100 !== 0) ||
                        itemValue % 400 === 0;
                      const daysInMonth = [
                        31,
                        isLeapYear ? 29 : 28,
                        31,
                        30,
                        31,
                        30,
                        31,
                        31,
                        30,
                        31,
                        30,
                        31,
                      ];

                      const newDay =
                        usDob.getDate() > daysInMonth[usDob.getMonth()]
                          ? daysInMonth[usDob.getMonth()]
                          : usDob.getDate();

                      const newDate = new Date(
                        itemValue,
                        usDob.getMonth(),
                        newDay
                      );
                      setUsDob(newDate);
                    }}
                    style={{ height: 50, width: "40%" }}
                  >
                    {[...Array(105)].map((_, i) => (
                      <Picker.Item
                        key={i + 1920}
                        label={(i + 1920).toString()}
                        value={i + 1920}
                      />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={usDob.getMonth()}
                    onValueChange={(itemValue, itemIndex) => {
                      const isLeapYear =
                        (usDob.getFullYear() % 4 === 0 &&
                          usDob.getFullYear() % 100 !== 0) ||
                        usDob.getFullYear() % 400 === 0;
                      const daysInMonth = [
                        31,
                        isLeapYear ? 29 : 28,
                        31,
                        30,
                        31,
                        30,
                        31,
                        31,
                        30,
                        31,
                        30,
                        31,
                      ];

                      const newDay =
                        usDob.getDate() > daysInMonth[itemValue]
                          ? daysInMonth[itemValue]
                          : usDob.getDate();

                      const newDate = new Date(
                        usDob.getFullYear(),
                        itemValue,
                        newDay
                      );
                      setUsDob(newDate);
                    }}
                    style={{ height: 50, width: "30%" }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <Picker.Item
                        key={i}
                        label={(i + 1).toString()}
                        value={i}
                      />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={usDob.getDate()}
                    onValueChange={(itemValue, itemIndex) => {
                      const newDate = new Date(
                        usDob.getFullYear(),
                        usDob.getMonth(),
                        itemValue
                      );
                      setUsDob(newDate);
                    }}
                    style={{ height: 50, width: "30%" }}
                  >
                    {[...Array(31)].map((_, i) => (
                      <Picker.Item
                        key={i + 1}
                        label={(i + 1).toString()}
                        value={i + 1}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
              <View
                style={{
                  height: 100,
                  paddingTop: 15,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: "30%", fontSize: 16, fontWeight: "500" }}>
                  Điện thoại
                </Text>
                <View
                  style={{
                    width: "67%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "400", color: 'gray', fontWeight: 'bold' }}>
                    +84 {authUser?.phone.substring(1)}
                  </Text>
                  <Text
                    style={{ fontSize: 14, fontWeight: "400", color: "gray" }}
                  >
                    Số điện thoại này chỉ hiển thị với người có lưu số bạn trong
                    danh bạ máy
                  </Text>
                </View>
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 20,
                  paddingTop: 10,
                }}
              >
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "#bbb" : "#d9d9d9",
                      borderRadius: 30,
                      width: "80%",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 50,
                      flexDirection: "row",
                    },
                  ]}
                  onPress={handleUpdateProfile}
                >
                  <FontAwesomeIcons name="edit" size={24} color="black" />
                  <Text
                    style={{ fontSize: 16, fontWeight: "500", paddingLeft: 15 }}
                  >
                    Chỉnh sửa
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setIsModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                width: "100%",
                height: 300,
              }}
            >
              <Pressable
                style={{
                  width: "100%",
                  alignItems: "center",
                  height: 30,
                  justifyContent: "flex-start",
                  backgroundColor:'red'
                }}
                onPress={() => setIsModalVisible(!modalVisible)}
              >
                <View
                  style={{
                    width: "20%",
                    height: 6,
                    backgroundColor: "#e0e3e5",
                    borderRadius: 20,
                  }}
                ></View>
              </Pressable>
              <Text
                style={{
                  color: "#6c8dc1",
                  fontWeight: "bold",
                  margin: 10,
                  fontSize: 16,
                }}
              >
                Ảnh đại diện
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcons name="user-circle" size={30} color="gray" />
                <Text
                  style={{
                    margin: 15,
                    fontSize: 16,
                    justifyContent: "center",
                    fontWeight: "400",
                  }}
                >
                  Xem ảnh đại diện
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons name="camera-outline" size={30} color="gray" />
                <Text
                  style={{
                    margin: 15,
                    fontSize: 16,
                    justifyContent: "center",
                    fontWeight: "400",
                  }}
                >
                  Chụp ảnh mới
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  margin: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons name="image-outline" size={30} color="gray" />
                <Text
                  style={{
                    margin: 15,
                    fontSize: 16,
                    justifyContent: "center",
                    fontWeight: "400",
                  }}
                >
                  Chọn ảnh trên máy
                </Text>
              </View>
            </View>
          </View>
        </Modal> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>
                Xác nhận email: {usEmail}?
              </Text>
              <Text style={styles.modalText}>
                Email này sẽ được sử dụng để gửi mã xác thực
              </Text>
              <View style={styles.modalButtonContainer}>
                <Pressable onPress={toggleModal}>
                  <Text style={styles.modalButton}>HỦY</Text>
                </Pressable>
                <Pressable onPress={handleXacNhan}>
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.modalButton}>XÁC NHẬN</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalAuthCode}
          onRequestClose={toggleModalAuthCode}
        >
          <View style={styles.modalContainerAuthCode}>
            <View style={styles.modalAuthCode}>
              <View style={{ backgroundColor: "#E5E7EB", padding: 10 }}>
                <Text style={{ textAlign: "center", color: "#000" }}>
                  Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản
                </Text>
              </View>
              <View style={{ flexDirection: "column", flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <FontAwesome5
                    name={"envelope"}
                    size={80}
                    color="black"
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{ fontWeight: "bold", color: "#000", marginTop: 10 }}
                  >
                    Đang gửi mã xác thực đến email: {usEmail}
                  </Text>
                  {isLoading ? (
                    <ActivityIndicator color="blue" />
                  ) : (
                    <Text></Text>
                  )}
                </View>
                <View style={{ flex: 1, padding: 10 }}>
                  <View style={styles.otpContainer}>
                    <OTPTextView
                      handleTextChange={handleOTPChange}
                      inputCount={6}
                      keyboardType="numeric"
                      tintColor="#00FF66"
                      offTintColor="#00FFFF"
                      containerStyle={styles.otpContainer}
                      textInputStyle={styles.otpInput}
                    />
                  </View>

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Pressable
                      style={{
                        flexDirection: "row",
                        width: "45%",
                        justifyContent: "space-between",
                        height: 40,
                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        style={{
                          backgroundColor: isPreSendCode ? "#8a57b6" : "gray", // Đổi màu nút tùy thuộc vào giá trị của isPreSendCode
                          borderRadius: 10,
                          width: "65%",
                          height: "90%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={isPreSendCode ? pressPreSendOTP : null} // Kiểm tra isPreSendCode trước khi gọi hàm pressPreSendOTP
                        disabled={!isPreSendCode} // Vô hiệu hóa nút khi isPreSendCode là false
                      >
                        <Text style={{ color: "white", fontWeight: "bold" }}>
                          Gửi lại mã
                        </Text>
                      </Pressable>
                      <Text style={{ color: "#0091FF", fontWeight: "bold" }}>
                        {timeLeft === 0 ? "0:0" : formatTime(timeLeft)}
                      </Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: "#0091FF",
                        width: 120,
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 25,
                      }}
                      onPress={() => {
                        toggleModalAuthCode();
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Huỷ
                      </Text>
                    </Pressable>

                    <Pressable
                      style={{
                        backgroundColor: "#0091FF",
                        width: 120,
                        height: 50,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 25,
                      }}
                      onPress={handleVerifyOTP}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Tiếp tục
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalSuccess}
          onRequestClose={() => setIsModalSuccess(false)}
        >
          <Pressable style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeaderText}>
                Cập nhật thông tin cá nhân thành công
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "center", }}>
                <Pressable style={{ backgroundColor: '#0091FF', alignItems: 'center', borderRadius: 10 }} onPress={() => { navigation.navigate("PersonalPage") }}>
                  <Text style={{ fontWeight: "bold", paddingVertical: 10, paddingHorizontal: 20, color: "white", }}>OK</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});

export default PersonalInfo;