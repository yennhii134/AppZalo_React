import React, { useState } from "react";
import CountryDropdown from "./CountryDropdown";
import {
  View,
  Text,
  Pressable,
  Image,
  TextInput,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import useRegister from "../../hooks/useRegister";

const RegisterName = ({ navigation }) => {
  const [textName, setTextName] = useState("");
  const [textPhone, setTextPhone] = useState("");
  const [textEmail, setTextEmail] = useState("");
  const { checkMail } = useRegister();
  const [isLoading, setIsLoading] = useState(false);
  const [isHiddenRegex, setIsHiddenRegex] = useState([])

  const handlePressablePress = async () => {
    const newError = []
    if (!/^([a-zA-Zá-ỹÁ-Ỹ\s]{2,40})$/.test(textName)) {
      newError.push('name')
    }
    if (!/^[0-9]{8,20}$/.test(textPhone)) {
      newError.push('phone')
    }
    if (!textEmail.trim().toLowerCase().endsWith("@gmail.com") || textEmail.length < 15) {
      newError.push('invalid email')
    }
    if (newError.length > 0) {
      setIsHiddenRegex(newError)
    }
    else {
      setIsLoading(true)
      setIsHiddenRegex([])
      const systemOTP = await checkMail(textEmail);
      if (systemOTP) {
        setIsLoading(false)
        navigation.navigate("RegisterInfo", { name: textName, textPhone: textPhone, textEmail: textEmail });
      }
      else {
        newError.push('email exists')
        setIsHiddenRegex(newError)
      }
      setIsLoading(false)
    }
  };
  const renderRegex = (error, message) => {
    return (
      isHiddenRegex.map((regex, index) => (
        regex === error &&
        <View key={index} style={{ marginHorizontal: 10 }}>
          <Text style={{ color: 'red', fontWeight: '600' }}> {message}</Text>
        </View>
      ))
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.toastContainer}>
      </View>
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(input) => { setTextName(input) }}
            value={textName}
            placeholder="Tên"
            placeholderTextColor={'gray'}
            style={styles.input}
          ></TextInput>
        </View>
        {renderRegex('name', '* Tên là chữ và ít nhất 2 kí tự')}
        <View style={styles.inputContainerPhone}>
          <CountryDropdown />
          <TextInput
            onChangeText={(input) => { setTextPhone(input) }}
            value={textPhone}
            placeholder="Nhập số điện thoại"
            placeholderTextColor={'gray'}
            style={styles.input}
            keyboardType="numeric"
          />
        </View>
        {renderRegex('phone', '* Số điện thoại phải từ 8 đến 20 chữ số')}
        <View style={styles.inputContainer}>
          <TextInput
            id="email"
            value={textEmail}
            placeholder="Email"
            placeholderTextColor={"gray"}
            style={styles.input}
            onChangeText={(text) => { setTextEmail(text) }}
          />
        </View>
        {renderRegex('invalid email', '* Email phải có định dạng @gmail.com và phải có ít nhất 15 ký tự')}
        {renderRegex('email exists', '* Email đã tồn tại')}
        <Text style={styles.note_title}>Lưu ý khi đặt tên:</Text>
        <Text style={styles.note}>
          Nên sử dụng tên thật để giúp bạn bè dễ nhận ra bạn
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.validButton]}
          onPress={handlePressablePress}
        >
          <View>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Image
                style={styles.buttonIcon}
                source={require("../../../assets/arrow.png")}
              ></Image>
            )}

          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#64D6EA",
  },
  inputContainerPhone: {
    flexDirection: "row",
    margin: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#64D6EA",
  },
  label: {
    fontWeight: "bold",
    fontSize: 20,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 16,
    marginVertical: 10,
  },
  note_title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
    paddingLeft: 20,
    marginVertical: 15,
  },
  note: {
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    margin: 5,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  validButton: {
    backgroundColor: "#0091FF",
  },
  buttonIcon: {
    width: 50,
    height: 50,
  },
  toastContainer: {
    zIndex: 99,
  },
  bullet: {
    fontSize: 20,
    marginRight: 10,
  },
});

export default RegisterName;
