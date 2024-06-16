import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    Modal,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-toast-message";
import useOTP from "../../hooks/useOTP";
import useToast from "../../hooks/useToast";

const AuthenOTP = ({ textEmail, onOtpVertified, onIsModalVisible, onCloseModel }) => {
    const [isModalAuthCode, setModalAuthCode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [isPreSendCode, setIsPreSendCode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const { getOTP } = useOTP();
    const [checkLength, setCheckLength] = useState(false)
    const [otpGetFromEmail, setOTPGetFromEmail] = useState("")
    const { showToastError } = useToast()
    const onIsModalVisibleFT = useRef(onIsModalVisible)
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCheckButton, setIsCheckButton] = useState(false)

    useEffect(() => {
        if (onIsModalVisibleFT.current) {
            setModalVisible(true)
        }
    }, [])

    const openModalAuthenOTP = () => {
        setModalVisible(false)
        setModalAuthCode(true)
        pressSendOTP()
    }

    const pressSendOTP = async () => {
        setIsLoading(true)
        const systemOTP = await getOTP(textEmail);
        if (systemOTP) {
            console.log("systemOTP", systemOTP);
            setIsPreSendCode(false)
            setTimeLeft(60)
            setOTPGetFromEmail(systemOTP)
            setIsCheckButton(true)
        }
        setIsLoading(false)
    };

    // đếm thời gian giảm dần
    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if(!isCheckButton) {
            return;
        }
         else {
            setIsPreSendCode(true);
            clearInterval(timer);
        }

        // Xóa interval khi component bị unmount
        return () => clearInterval(timer);
    }, [timeLeft]);


    const handleVerifyOTP = () => {
        if (otp === otpGetFromEmail.otp && otpGetFromEmail.expires >= Date.now()) {
            onOtpVertified(true)
            setModalAuthCode(false)
        }
        else {
            showToastError("Mã OTP không khớp");
            console.log("Mã OTP không khớp");
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    const handleOTPChange = (enteredOtp) => {
        if (enteredOtp.length === 6) {
            setCheckLength(true)
            setOtp(enteredOtp)
        } else {
            setCheckLength(false)
        }
    }
    const handleCancel = () => {
        setModalAuthCode(false);
        onOtpVertified(false);
        onCloseModel(false);
        setTimeLeft(0)
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
            // onRequestClose={() => setModalVisible(!isModalVisible)}
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
                            <Pressable onPress={() => { onCloseModel(false); setModalVisible(false) }}>
                                <Text style={styles.modalButton}>HỦY</Text>
                            </Pressable>
                            <Pressable onPress={openModalAuthenOTP}>
                                {isLoading ? (
                                    <ActivityIndicator color="blue" />
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
            // onRequestClose={() => setModalAuthCode(!isModalAuthCode)}
            >
                <View style={styles.modalContainerAuthCode}>
                    <Toast />
                    <View style={styles.modalAuthCode}>
                        <View style={{ backgroundColor: "#E5E7EB", padding: 10 }}>
                            <Text style={{ textAlign: "center", color: "#000" }}>
                                Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản
                            </Text>
                        </View>
                        <View style={{ flexDirection: "column", height: '70%' }}>
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 10, }}>
                                <FontAwesome5 name={"envelope"} size={80} color="black" style={{ marginRight: 8 }} />
                                <Text style={{ fontWeight: "bold", color: "#000", marginVertical: 10, textAlign: 'center' }}>
                                    Đang gửi mã xác thực đến email: {textEmail}
                                </Text>
                                {isLoading && (
                                    <ActivityIndicator color="blue" />
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

                                <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20, }}>
                                    <Pressable style={{ flexDirection: 'row', width: '45%', justifyContent: 'space-between', height: 40, alignItems: 'center' }}>
                                        <Pressable style={{
                                            backgroundColor: isPreSendCode ? '#8a57b6' : 'gray', // Đổi màu nút tùy thuộc vào giá trị của isPreSendCodeborderRadius: 10,
                                            width: '65%', height: '90%', alignItems: 'center', justifyContent: 'center'
                                        }}
                                            onPress={isPreSendCode ? pressSendOTP : null} // Kiểm tra isPreSendCode trước khi gọi hàm pressPreSendOTP
                                            disabled={!isPreSendCode} // Vô hiệu hóa nút khi isPreSendCode là false
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Gửi lại mã</Text>
                                        </Pressable>
                                        <Text style={{ color: "#0091FF", fontWeight: 'bold' }}>{timeLeft === 0 ? "0:0" : formatTime(timeLeft)}</Text>
                                    </Pressable>
                                </View>
                                <View style={{ justifyContent: "space-evenly", alignItems: "center", flexDirection: 'row' }}>
                                    <Pressable
                                        style={{ backgroundColor: "#0091FF", width: 120, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 25, }}
                                        onPress={handleCancel}>
                                        <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                            Huỷ
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        style={[{ width: 120, height: 50, justifyContent: "center", alignItems: "center", borderRadius: 25, },
                                        checkLength ? { backgroundColor: "#0091FF" } : { backgroundColor: "#BFD3F8" }
                                        ]}
                                        onPress={handleVerifyOTP}
                                        disabled={!checkLength}>
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
        </View>
    )
}

const styles = StyleSheet.create({
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
})
export default React.memo(AuthenOTP);