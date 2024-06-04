import React, { useState, useRef } from "react";
import { View, Text, Pressable, Image, TextInput } from "react-native";

const EnterAuthCode = () => {
  const [inputs, setInputs] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleInputChange = (text, index) => {
    const newInputs = [...inputs];
    newInputs[index] = text;

    // Check if the input is filled and move focus to the next input
    if (text && index < inputs.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    setInputs(newInputs);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
          <Image
            style={{ width: "20%", aspectRatio: 1 }}
            resizeMode="contain"
            source={require("../../../assets/phone.png")}
          />
          <Text style={{ fontWeight: "bold", color: "#000", marginTop: 10 }}>
            Đang gọi đến số (+84) 338 030 541
          </Text>
          <Text style={{ color: "#000", marginTop: 5 }}>
            Vui lòng bắt máy để nghe mã
          </Text>
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            {inputs.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={{
                  borderBottomWidth: 2,
                  borderColor: "#ccc",
                  width: 40,
                  marginRight: 5,
                  textAlign: "center",
                }}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            ))}
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "#888" }}>
              Gửi lại mã <Text style={{ color: "#0091FF" }}>00:57</Text>
            </Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Pressable
              style={{
                backgroundColor: "#0091FF",
                width: 120,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Tiếp tục
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EnterAuthCode;
