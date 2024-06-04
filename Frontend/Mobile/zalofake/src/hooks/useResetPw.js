import { useState } from "react";
import Toast from "react-native-toast-message";
import axiosInstance from "../api/axiosInstance";

const useForgotPw = () => {
    const [systemOTP, setSystemOTP] = useState(null);
    const [isOTPVerified, setIsOTPVerified] = useState(false);

    const showToastSuccess = (notice) => {
        Toast.show({
            text1: notice,
            type: "success",
            topOffset: 0,
            position: "top",
        });
    };
    const showToastError = (notice) => {
        Toast.show({
            text1: notice,
            type: "error",
            topOffset: 0,
            position: "top",
        });
    };

    const verifyOTP = async (userOTP, systemOTP) => {
        if (userOTP === systemOTP.otp && systemOTP.expires >= Date.now()) {
            return true;
        } else {
            return false;
        }
    };

    const sendOTP = async (email) => {
        const response = await axiosInstance.post("/auth/send-otp", {
            email,
        });
        const data = response?.data;
        return data.totp;
    };

    const check_mail = async (email) => {
        try {
            const response = await axiosInstance.post("/users/check-email", {
                email,
            });
          
            if(response?.status === 404) {
                showToastError(response.data.message);
                return false;
            }
            else if (response.status === 200) {
                return true;
            }
            else {
                // toast.error(data.response.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            showToastError(error.response.data.message);
            return false;
        }
    }
    const getOTP = async (email) => {
        try {
            setIsOTPVerified(false);
            const otp = await sendOTP(email);

            if (otp) {
                showToastSuccess("OTP sent to your email");
                setSystemOTP(otp);
                return true;
            } else {
                showToastError("Failed to send OTP");
                return false;
            }
        } catch (error) {
            console.log(error);
            showToastError("Failed to send OTP");
            return false;
        }
    };

    const handleOTP = async (otp) => {
        const verified = await verifyOTP(otp, systemOTP);
        setIsOTPVerified(verified);
        try {
            if (verified) {
                showToastSuccess("Valid OTP")
                setIsOTPVerified(true)
                return true;
            }
            else {
                showToastError("Invalid OTP");
                return false;
            }
        } catch (error) {
            console.log(error);
            setIsOTPVerified(true);
            showToastError(error.response.data.message);
            return false;
        }
    }

    const resetPassword = async ( email, newPassword) => {
        try {
            const response = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
            });
            if(response?.status === 404){
                return false;
            }
            else if(response?.status === 400){
                return false;
            }
            else if (response.status === 200) {
                return true;
            } else {
                showToastError("Failed to reset password")
                return false;
            }

        } catch (error) {
            console.log(error);
            setIsOTPVerified(true);
            showToastError(error.response.data.message);
            return false;
        }
    }
    return {
        isOTPVerified,
        getOTP,
        resetPassword,
        handleOTP,
        showToastError,
        showToastSuccess,
        check_mail
    };
};

export default useForgotPw ;

