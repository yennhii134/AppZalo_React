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
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import { useAuthContext } from "../../../contexts/AuthContext";
import RadioButton from "react-native-radio-buttons-group";
import useUpdate from "../../../hooks/useUpdate";
import useToast from "../../../hooks/useToast";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ModalUpdateImageProfile from "./ModalUpdateImageProfile";
import AuthenOTP from "../../ModalComponents/AuthenOTP"

const PersonalInfo = ({ navigation }) => {
  const { authUser } = useAuthContext();
  const [originalProfile, setOriginalProfile] = useState({
    name: authUser.profile.name,
    email: authUser.email,
    gender: authUser?.profile?.gender,
    dob: new Date(authUser?.profile?.dob),
  });
  const [usDob, setUsDob] = useState(new Date(authUser?.profile.dob));
  const [usGender, setUsGender] = useState(authUser?.profile.gender);
  const [usName, setUsName] = useState(authUser?.profile?.name);
  const [usEmail, setUsEmail] = useState(authUser?.email);
  const { updateProfile } = useUpdate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(false);
  const { showToastError } = useToast()
  const [isOtpVertified, setIsOtpVertified] = useState(false)
  const [modalUpdateImage, setModalUpdateImage] = useState(false);
  const [type, setType] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(null)
  const [selectedBackground, setSelectedBackground] = useState(null)
  const { uploadImageProfile } = useUpdate();
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [changedFields, setChangeFields] = useState({});

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

  const handleChange = (field, value) => {
    let isFieldUpdated;
    if (field === 'dob') {
      const age = new Date().getFullYear() - value.getFullYear();
      isFieldUpdated = age >= 16 && value.getTime() !== originalProfile.dob.getTime();
    } else if (field === 'name') {
      isFieldUpdated = value && value !== originalProfile.name;
    } else if (field === 'email') {
      isFieldUpdated = value && value !== originalProfile.email && value.trim().toLowerCase().endsWith("@gmail.com");
    } else if (field === 'gender') {
      isFieldUpdated = value !== originalProfile.gender;
    }

    if (isFieldUpdated) {
      setChangeFields({ ...changedFields, [field]: value });
      setIsUpdate(true);
    } else {
      const newChangedFields = { ...changedFields };
      delete newChangedFields[field];
      setChangeFields(newChangedFields);
      setIsUpdate(Object.keys(newChangedFields).length > 0);
    }

    if (field === 'dob') setUsDob(value);
    if (field === 'name') setUsName(value);
    if (field === 'email') setUsEmail(value);
    if (field === 'gender') setUsGender(value);
  }
  const validateData = () => {
    // Kiểm tra xem tất cả các trường đều được nhập
    if (!usName || !usEmail || !usGender || !usDob) {
      showToastError("Vui lòng nhập đầy đủ thông tin !")
      return false;
    }

    // Kiểm tra định dạng email
    if (!usEmail.trim().toLowerCase().endsWith("@gmail.com")) {
      showToastError("Email phải có định dạng @gmail.com")
      return false;
    }

    if (new Date().getFullYear() - usDob.getFullYear() < 16) {
      showToastError("Phải trên 16 tuổi")
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async () => {
    if (!validateData()) {
      return;
    }
    if (Object.keys(changedFields).length === 0 && !selectedAvatar && !selectedBackground) {
      showToastError("Không có thông tin nào thay đổi")
      return;
    }
    if (usEmail !== authUser?.email) {
      setIsModalVisible(true);
    } else {
      handleUpdateProfileNew();
    }
  };

  useEffect(() => {
    if (isOtpVertified) {
      if (Object.keys(changedFields).length > 0 || selectedAvatar || selectedBackground) {
        handleUpdateProfileNew();
      } else {
        setIsModalSuccess(true)
      }
    }
  }, [isOtpVertified])

  const handleUpdateProfileNew = async () => {
    setIsLoading(true)
    try {
      if (selectedAvatar) {
        await uploadImageProfile("Avatar", selectedAvatar)
      }
      if (selectedBackground) {
        await uploadImageProfile("Background", selectedBackground)
      }
      await updateProfile(usName, usEmail, usGender, usDob);
      setIsModalSuccess(true)
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsLoading(false)
  };

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
  const openModalUpdateImage = (typeUpload) => {
    setType(typeUpload)
    setModalUpdateImage(true)
  }

  return (
    <View style={{ backgroundColor: "#EFEFEF", flex: 1 }}>
      <ScrollView>
        <View>
          <Pressable onPress={() => openModalUpdateImage("Background")}>
            <Image
              source={{
                uri:
                  selectedBackground ||
                  authUser.profile.background.url 
              }}
              style={{ width: "100%", height: 250 }}
            />
          </Pressable>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: -100,
              alignItems: "center",
              paddingBottom: 10,
              paddingLeft: 10,
            }}
          >
            <Pressable
              onPress={() => openModalUpdateImage("Avatar")}
            >
              <Image
                source={{
                  uri:
                    selectedAvatar ||
                    authUser.profile.avatar.url
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
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}>
                {authUser.profile.name}
              </Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: "#fff", paddingTop: 15, paddingLeft: 10 }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 10 }}
            >
              Thông tin cá nhân
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  height: 60,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBlockColor: "#e0e3e5",
                }}
              >
                <Text style={{ width: "30%", fontSize: 16, fontWeight: "500", color: 'gray' }}>
                  Tên hiển thị:
                </Text>
                <TextInput
                  style={{ fontSize: 18, width: 370, fontWeight: '500' }}
                  defaultValue={usName}
                  onChangeText={(text) => { handleChange("name", text) }}
                />
              </View>
              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500", color: 'gray' }}>
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
                  style={{ fontSize: 18, width: 370, fontWeight: '500' }}
                  defaultValue={usEmail}
                  onChangeText={(text) => { handleChange("email", text) }}
                />
              </View>

              <Text style={{ width: "30%", fontSize: 16, fontWeight: "500", color: 'gray' }}>
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
                    onPress={(value) => { handleChange("gender", value) }}
                    selectedId={usGender}
                    layout="row"
                    labelStyle={{ fontSize: 18 }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  height: 60,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBlockColor: "#e0e3e5",
                }}
              >
                <Text style={{ width: "30%", fontSize: 16, fontWeight: "500", color: 'gray' }}>
                  Ngày sinh
                </Text>
                <RNDateTimePicker
                  display="default"
                  testID="dateTimePicker"
                  value={usDob}
                  mode={'date'}
                  onChange={(event, date) => handleChange('dob', date)}
                  style={{ width: '30%' }}
                />
              </View>
              <View
                style={{
                  height: 100,
                  paddingTop: 15,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ width: "30%", fontSize: 16, fontWeight: "500", color: 'gray' }}>
                  Điện thoại
                </Text>
                <View
                  style={{
                    width: "67%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: "600" }}>
                    +84 {authUser.phone.substring(1)}
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
                  style={{
                    backgroundColor: isUpdate ? "#4b91c8" : "#d9d9d9",
                    borderRadius: 30,
                    width: "80%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    flexDirection: "row",
                  }}
                  onPress={handleUpdateProfile}
                >
                  {
                    isLoading ? <ActivityIndicator color="black" />
                      : <FontAwesomeIcons name="edit" size={24} color="black" />
                  }
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
        {isModalVisible &&
          <AuthenOTP
            textEmail={usEmail}
            onOtpVertified={(otpVertified) => setIsOtpVertified(otpVertified)}
            onIsModalVisible={isModalVisible}
            onCloseModel={(onClose) => setIsModalVisible(onClose)}
          />
        }
        {
          modalUpdateImage &&
          <ModalUpdateImageProfile
            onOpen={modalUpdateImage}
            type={type}
            isUpdate={false}
            onClose={(close) => setModalUpdateImage(close)}
            renderImage={(image) => { type === "Avatar" ? setSelectedAvatar(image) : setSelectedBackground(image) }}
          />
        }
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