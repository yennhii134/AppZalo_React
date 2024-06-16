import { View, Text, Pressable, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import usePassword from "../../hooks/usePassword";
import useToast from "../../hooks/useToast";
import ResetPassword from "../ModalComponents/ResetPassword";
import useAuth from "../../hooks/useAuth";

const ChangePassword = ({ navigation }) => {
    const { showToastError } = useToast();
    const { changePassword } = usePassword();
    const logout = useAuth();
    const [modalSuccess, setModalSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [isResetPassword, setIsResetPassword] = useState(false)
    const [isLogin, setIsLogin] = useState(false)
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [newPasswordRetry, setNewPasswordRetry] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [buttonText, setButtonText] = useState('Hiện');

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                        Đổi mật khẩu
                    </Text>
                </View>
            ),
            headerStyle: {
                backgroundColor: "#0091FF",
                shadowColor: "#fff",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
            },
        });
    }, [navigation]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setButtonText(showPassword ? 'Hiện' : 'Ẩn');
    };

    const handleUpdatePassword = async () => {
        setIsLoading(true)
        if (!oldPassword) {
            showToastError("Vui lòng nhập mật khẩu hiện tại")
            setIsLoading(false)
        }
        else if (!newPassword) {
            showToastError("Vui lòng nhập mật khẩu mới")
            setIsLoading(false)
        }
        else if (!/^[A-Za-z\d@$!%*?&#]{6,}$/.test(newPassword)) {
            showToastError("Mật khẩu không hợp lệ");
            setIsLoading(false)
        } else if (
            !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(
                newPassword
            )
        ) {
            showToastError("MK chứa ít nhất 1 chữ,1 số,1 ký tự đặc biệt");
            setIsLoading(false)
        }
        else if (!(newPassword === newPasswordRetry)) {
            showToastError("Vui lòng nhập lại mật khẩu trùng khớp");
            setIsLoading(false)
        }
        else {
            const rs = await changePassword(oldPassword, newPassword);
            if (rs) {
                setIsLoading(false)
                setModalSuccess(true)
            }
            setIsLoading(false)
        }
    }
    useEffect(() => {
        if (isLogin) {
            handleLogout()
        }
    }, [isLogin])

    const handleLogout = async () => {
        setModalSuccess(false)
        try {
            await logout();
        } catch (error) {
            console.log(error);
            showToastError("Lỗi ! Vui lòng thử lại sau");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {isResetPassword ?
                <ResetPassword
                    email={''}
                    onClose={(close) => setIsResetPassword(close)}
                    onLogin={(isLogin) => setIsLogin(isLogin)}
                />
                :
                <>
                    <View style={{ alignItems: 'center' }}>
                        <View style={styles.toastContainer}>
                            <Toast />
                        </View>
                        <View style={{ width: '90%' }}>
                            <View style={[{ height: 75 }, styles.styleCenter]}>
                                <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Mật khẩu phải gồm 6 kí tự bao gồm chữ, số hoặc ký tự đặc biệt.</Text>
                            </View>
                            <View style={styles.styleViewBlue}>
                                <Text style={[styles.styleText, styles.styleColorBlue]}>Mật khẩu hiện tại
                                </Text>
                                {/* <Text style={[styles.styleText]}>Hiện</Text> */}
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <View>
                                        <Text style={[styles.styleText]}>{buttonText}</Text>

                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.styleViewGray}>
                                <TextInput style={[styles.styleText, styles.styleColorGray, { width: '90%' }]}
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    secureTextEntry={!showPassword}
                                ></TextInput>
                                {oldPassword ? (
                                    <Pressable style={styles.styleIcon} onPress={() => setOldPassword(null)}>
                                        <Ionicons name="close" size={22} color="gray" />
                                    </Pressable>) : null}
                            </View>
                            <View style={styles.styleViewBlue}>
                                <Text style={[styles.styleText, styles.styleColorBlue]}>Mật khẩu mới</Text>
                            </View>
                            <View style={styles.styleViewGray}>
                                <TextInput style={[styles.styleText, styles.styleColorGray, { width: '90%' }]}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    placeholder="Nhập mật khẩu mới"
                                    secureTextEntry={!showPassword}
                                ></TextInput>
                                {newPassword ? (
                                    <Pressable style={styles.styleIcon} onPress={() => setNewPassword(null)}>
                                        <Ionicons name="close" size={22} color="gray" />
                                    </Pressable>
                                ) : null}
                            </View>
                            <View style={styles.styleViewGray}>
                                <TextInput style={[styles.styleText, styles.styleColorGray, { width: '90%' }]}
                                    value={newPasswordRetry}
                                    onChangeText={setNewPasswordRetry}
                                    placeholder="Nhập lại mật khẩu mới"
                                    secureTextEntry={!showPassword}
                                ></TextInput>
                                {newPasswordRetry ? (
                                    <Pressable style={styles.styleIcon} onPress={() => setNewPasswordRetry(null)}>
                                        <Ionicons name="close" size={22} color="gray" />
                                    </Pressable>
                                ) : null}
                            </View>

                            <Pressable style={[{ width: '50%', height: 40 }, styles.styleCenter]}
                                onPress={() => { setIsResetPassword(true) }}
                            >
                                <Text style={[styles.styleText, { color: 'red', fontWeight: '600' }]}>Quên mật khẩu?</Text>
                            </Pressable>
                        </View>
                        <Pressable style={[styles.styleButton, styles.styleCenter, { margin: 30 }]} onPress={handleUpdatePassword}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={[styles.styleText, { color: 'white', fontWeight: 'bold' }]}>Cập nhật</Text>
                            )}
                        </Pressable>
                    </View>
                </>
            }
            <View>
                {/* Modal xác nhận  */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={modalSuccess}
                    onRequestClose={() => { setModalSuccess(!modalSuccess) }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalSuccess}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                                    <View>
                                        <Ionicons name={"checkmark-circle-sharp"} size={80} color="#00ce3a" style={{ marginRight: 8 }} />
                                    </View>
                                    <Text style={styles.modalHeaderText}>Đổi mật khẩu thành công!</Text>
                                    <Text style={styles.modalText}>
                                        Vui lòng đăng nhập lại
                                    </Text>

                                    <View style={styles.modalButtonContainer}>
                                        <Pressable style={styles.buttonCreatePass} onPress={handleLogout}>
                                            <Text style={styles.modalButton}>OK</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>

    );
};

export default ChangePassword;

const styles = {
    styleText: {
        fontSize: 18
    },
    styleColorBlue: {
        color: '#4185ca',
        fontWeight: 'bold'
    },
    styleColorGray: {
        color: 'gray',
        fontWeight: '500',
        backgroundColor: 'white'
    },
    styleCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    styleViewBlue: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40
    },
    styleViewGray: {
        height: 55,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e3e5',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    styleButton: {
        backgroundColor: '#0091FF',
        height: 45,
        width: '50%',
        borderRadius: 25
    },
    styleIcon: {
        height: '100%',
        width: '10%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    toastContainer: {
        zIndex: 99,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalSuccess: {
        backgroundColor: "#fff",
        width: '80%',
        height: '40%',
        borderRadius: 10,
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
    buttonCreatePass: {
        width: '80%',
        height: 45,
        backgroundColor: '#0091FF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalButton: {
        fontWeight: "bold",
        marginHorizontal: 10,
        color: "white",
        fontSize: 16
    },
};