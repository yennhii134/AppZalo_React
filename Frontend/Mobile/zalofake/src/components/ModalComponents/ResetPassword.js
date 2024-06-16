import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    TextInput,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthenOTP from "../ModalComponents/AuthenOTP";
import useToast from "../../hooks/useToast";
import usePassword from "../../hooks/usePassword";
import useAuth from "../../hooks/useAuth";

const ResetPassword = ({ email, onClose, onLogin }) => {
    const [textEmail, setTextEmail] = useState(null);
    const [modelSuccess, setModalSuccess] = useState(false)
    const [isView, setIsView] = useState(false)
    const [modalResetSuccess, setModalResetSuccess] = useState(false)
    const [newPassword, setNewPassword] = useState(null);
    const [newPassword2, setNewPassword2] = useState(null);
    const [buttonText, setButtonText] = useState('Hiện');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { resetPassword, check_mail } = usePassword();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isError, setIsError] = useState([])
    const { showToastError } = useToast()
    const [isOtpVerified, setIsOtpVerified] = useState(false);

    //   const { checkScreen } = route.params || {};
    const logout = useAuth();

    useEffect(() => {
        if (email && email.trim().toLowerCase().endsWith("@gmail.com")) {
            setTextEmail(email)
        }
    }, [])

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setButtonText(showPassword ? 'Hiện' : 'Ẩn');
    };

    const handleNext = async () => {
        const newError = []
        if (!textEmail) {
            newError.push("Vui lòng nhập gmail")
        }
        else if (!textEmail.trim().toLowerCase().endsWith("@gmail.com")) {
            newError.push("Email phải có định dạng @gmail.com")
        }
        if (newError.length > 0) {
            setIsError(newError)
        } else {
            setIsLoading(true)
            setIsError([])
            const sendEmail = await check_mail(textEmail);
            if (!sendEmail) {
                newError.push("Email không tồn tại")
                setIsError(newError)
                setIsLoading(false)
                return;
            }
            setIsError([])
            setIsLoading(false)
            setModalVisible(true)
        }
    }
    useEffect(() => {
        if (isOtpVerified) {
            setModalSuccess(true)
        }
    }, [isOtpVerified])

    const handleResetPassword = async () => {
        setIsLoading(true)
        if (!newPassword) {
            showToastError("Vui lòng nhập mật khẩu mới")
            setIsLoading(false)
        }
        else if (!/^[A-Za-z\d@$!%*?&#]{6,}$/.test(newPassword)) {
            showToastError("Mật khẩu phải có ít nhất 6 ký tự,chứa ít nhất 1 chữ,1 số,1 ký tự đặc biệt");
            setIsLoading(false)
        } else if (
            !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(
                newPassword
            )
        ) {
            showToastError("MK chứa ít nhất 1 chữ,1 số,1 ký tự đặc biệt");
            setIsLoading(false)
        }
        else if (!(newPassword === newPassword2)) {
            showToastError("Vui lòng nhập lại mật khẩu trùng khớp");
            setIsLoading(false)
        }
        else {
            const rs = await resetPassword(textEmail, newPassword);
            if (rs) {
                setIsLoading(false)
                setModalResetSuccess(!modalResetSuccess)
            }
        }
    }

    const handleLogin = async () => {
        setModalResetSuccess(!modalResetSuccess)
        onClose(false)
        onLogin(true)
    }

    return (
        <View style={styles.container}>
            {isView ?
                <View style={styles.modalCreatePw}>
                    <View style={{ height: 40, justifyContent: 'center', backgroundColor: '#67bed9', width: '50' }}>
                        <Text style={{ color: 'white', fontSize: 16, paddingHorizontal: 20, paddingVertical: 10, fontWeight: 'bold' }}>Tạo mật khẩu mới</Text>
                    </View>
                    <View style={{ alignItems: 'center', paddingHorizontal: 20, height: '60%', justifyContent: 'space-evenly' }}>
                        <View style={styles.viewTextPwNew}>
                            <Text style={[styles.styleText, styles.textBlue]}>Mật khẩu mới
                            </Text>
                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                <View>
                                    <Text style={[styles.styleText, styles.textGray]}>{buttonText}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.styleViewGray}>
                            <TextInput style={[styles.styleText, styles.textInput, { width: '90%' }]}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Nhập mật khẩu mới"
                                placeholderTextColor="gray"
                                secureTextEntry={!showPassword}
                            ></TextInput>
                            {newPassword ? (
                                <Pressable style={styles.styleIcon} onPress={() => setNewPassword(null)}>
                                    <Ionicons name="close" size={22} color="gray" />
                                </Pressable>
                            ) : null}
                        </View>
                        <View style={styles.styleViewGray}>
                            <TextInput style={[styles.styleText, styles.textInput, { width: '90%' }]}
                                value={newPassword2}
                                onChangeText={setNewPassword2}
                                placeholder="Nhập lại mật khẩu mới"
                                placeholderTextColor="gray"
                                secureTextEntry={!showPassword}
                            ></TextInput>
                            {newPassword2 ? (
                                <Pressable style={styles.styleIcon} onPress={() => setNewPassword2(null)}>
                                    <Ionicons name="close" size={22} color="gray" />
                                </Pressable>
                            ) : null}
                        </View>
                        <Pressable style={[styles.styleButton, styles.styleCenter, { margin: 30 }]}
                            onPress={handleResetPassword}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={[styles.styleText, { color: 'white', fontWeight: 'bold' }]}>Cập nhật</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
                : <View style={{ paddingTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={styles.viewText}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Nhập gmail để lấy lại mật khẩu</Text>
                    </View>
                    <View style={styles.viewTextInput}>
                        <TextInput
                            value={textEmail}
                            onChangeText={setTextEmail}
                            placeholder="Nhập gmail"
                            placeholderTextColor="gray"
                            style={[styles.styleText, { width: '90%' }]}
                        >
                        </TextInput>
                        <Pressable style={styles.styleIcon} onPress={() => setTextEmail(null)}>
                            <Ionicons name="close" size={22} color="gray" />
                        </Pressable>
                    </View>
                    {isError?.map((err, index) => (
                        <View key={index} style={{ padding: 10 }}>
                            <Text style={{ color: 'red', fontWeight: '600' }}> {err}</Text>
                        </View>
                    ))}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable style={styles.styleButton}
                            onPress={() => onClose(false)}
                        >
                            <Text style={[styles.styleText, { color: 'white', fontWeight: 'bold' }]}>Huỷ</Text>
                        </Pressable>
                        <Pressable style={styles.styleButton}
                            onPress={handleNext}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={[styles.styleText, { color: 'white', fontWeight: 'bold' }]}>Tiếp tục</Text>
                            )}
                        </Pressable>
                    </View>
                </View >
            }

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

            {/* Modal Success */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modelSuccess}
                onRequestClose={() => { setModalSuccess(!modelSuccess) }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalSuccess}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                                <View>
                                    <Ionicons name={"checkmark-circle-sharp"} size={80} color="#00ce3a" style={{ marginRight: 8 }} />
                                </View>
                                <Text style={styles.modalHeaderText}>Đăng nhập thành công!</Text>
                                <Text style={styles.modalText}>
                                    Bây giờ bạn có thể tạo lại mật khẩu mới. Tài khoản và mật khẩu này dùng để đăng nhập trên bất kỳ thiết bị nào.
                                </Text>

                                <View style={styles.modalButtonContainer}>
                                    <Pressable style={styles.buttonCreatePass} onPress={() => { setModalSuccess(!modelSuccess); setIsView(true) }}>
                                        <Text style={styles.modalButton}>Tạo mật khẩu</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal reset thành công*/}
            < Modal
                animationType="slide"
                transparent={true}
                visible={modalResetSuccess}
                onRequestClose={() => { setModalResetSuccess(!modalResetSuccess) }}
            >
                <View style={styles.modalContainerAuthCode}>
                    <View style={styles.modalSuccess}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                                <View>
                                    <Ionicons name={"checkmark-circle-sharp"} size={80} color="#00ce3a" style={{ marginRight: 8 }} />
                                </View>
                                <Text style={styles.modalHeaderText}>Đổi mật khẩu thành công!</Text>
                                <Text style={styles.modalText}>
                                    Bây giờ bạn sẽ quay về trang đăng nhập để nhập mật khẩu mới.
                                </Text>

                                <View style={styles.modalButtonContainer}>
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Pressable style={[styles.buttonCreatePass, { margin: 20 }]} onPress={handleLogin}>
                                            <Text style={styles.modalButton}>Trở về</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal >

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    otpInput: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#333333',
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal: 5,
    },
    styleText: {
        fontSize: 18
    },
    styleCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewText: {
        width: '90%',
        height: 45,
        justifyContent: 'center'
    },
    viewTextInput: {
        marginTop: 10,
        width: '90%',
        height: 60,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#26d0f5',
        flexDirection: 'row',
    },
    styleButton: {
        backgroundColor: '#0091FF',
        height: 45,
        width: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 30
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: 300,
        height: 180,
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    pressCancel: {
        width: '50%',
        height: 40,
        borderTopWidth: 2,
        borderTopColor: '#e0e3e5',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textCancel: {
        color: '#0091FF',
        fontWeight: '600',
        fontSize: 16
    },
    modalContainerAuthCode: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainerPw: {
        alignItems: "center",
        width: '100%',
        height: '100%'
    },
    modalAuthCode: {
        backgroundColor: "#fff",
        width: '80%',
        height: '70%',
        padding: 10,
        borderRadius: 10,
        paddingBottom: 45
    },
    modalSuccess: {
        backgroundColor: "#fff",
        width: '80%',
        height: '40%',
        borderRadius: 10,
    },
    modalOTP: {
        backgroundColor: "#fff",
        width: '90%',
        height: '65%',
        alignItems: 'center',
        paddingBottom: 50
    },
    modalCreatePw: {
        backgroundColor: "#fff",
        // width: '100%',
        // height: '100%',
    },
    modalHeaderText: {
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        fontSize: 18,
        marginVertical: 10
    },
    modalText: {
        marginVertical: 20,
        marginHorizontal: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    modalButtonContainer: {
        justifyContent: "flex-end",
        width: '80%',
        alignItems: 'center'
    },
    modalButton: {
        fontWeight: "bold",
        marginHorizontal: 10,
        color: "white",
        fontSize: 16
    },
    buttonCreatePass: {
        width: '80%',
        height: 45,
        backgroundColor: '#0091FF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    styleButtonCreatePw: {
        backgroundColor: '#c0d4e3',
        height: 45,
        width: '50%',
        borderRadius: 25
    },
    viewTextPwNew: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        height: 55,
        alignItems: 'center'
    },
    textBlue: {
        color: '#4185ca',
        fontWeight: 'bold'
    },
    textGray: {
        color: 'gray',
        fontWeight: 'bold'
    },
    styleViewGray: {
        width: '90%',
        height: 55,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e3e5',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    styleIcon: {
        height: '100%',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textInput: {
        fontWeight: '600',
        backgroundColor: 'white'
    },
    toastContainer: {
        zIndex: 99,
    },
});

export default ResetPassword;
