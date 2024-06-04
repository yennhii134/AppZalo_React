import { useState } from "react";
import Toast from "react-native-toast-message";
import axiosInstance from "../api/axiosInstance";

const useForgot = () => {
    const [isLoading, setIsLoading] = useState(false);
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
        const data = response.data;
        return data.totp;
    };

    const check_mail = async (email) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.post("/users/check-email", {
                email,
            });
            const data = response.data;
            console.log(data);

            if (response.status === 200) {
                setIsLoading(false);
                return true;
            }
            else {
                setIsLoading(false);
                // toast.error(data.response.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            // toast.error(error.response.data.message);
            return false;
        }
    }
    const getOTP = async (email) => {
        try {
            setIsLoading(true);
            setIsOTPVerified(false);
            const otp = await sendOTP(email);

            if (otp) {
                showToastSuccess("OTP sent to your email");
                setIsLoading(false);
                setSystemOTP(otp);
                return true;
            } else {
                showToastError("Failed to send OTP");
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.log(error);
            showToastError("Failed to send OTP");
            setIsLoading(false);
            return false;
        }
    };

    const handleOTP = async (otp) => {
        const verified = await verifyOTP(otp, systemOTP);
        setIsOTPVerified(verified);
        try {
            setIsLoading(true);
            if (verified) {
                showToastSuccess("Valid OTP")
                setIsOTPVerified(true)
                setIsLoading(false);
                return true;
            }
            else {
                showToastError("Invalid OTP");
                setIsLoading(false);
                return false;
            }
        } catch (error) {
            console.log(error);
            setIsOTPVerified(true);
            setIsLoading(false);
            showToastError(error.response.data.message);
            return false;
        }
    }

    const resetPassword = async ( email, newPassword) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
            });

            if (response.status === 200) {
                showToastSuccess("Change Password Successfully");
                setIsLoading(false);
                return true;
            } else {
                showToastError("Failed to reset password")
                setIsLoading(false);
                return false;
            }

        } catch (error) {
            console.log(error);
            setIsOTPVerified(true);
            setIsLoading(false);
            showToastError(error.response.data.message);
            return false;
        }
    }
    return {
        isLoading,
        isOTPVerified,
        getOTP,
        resetPassword,
        handleOTP,
        showToastError,
        showToastSuccess,
        check_mail
    };
};

export default useForgot;

