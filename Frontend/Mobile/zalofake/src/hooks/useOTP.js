import axiosInstance from "../api/axiosInstance";
import useToast from "./useToast";

const useOTP = () => {
    const { showToastSuccess, showToastError } = useToast()

    const verifyOTP = async (userOTP, otpGetFromEmail) => {
        if (userOTP === otpGetFromEmail.otp && otpGetFromEmail.expires >= Date.now()) {
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

    const getOTP = async (email) => {
        try {
            const otp = await sendOTP(email);
            if (otp) {
                showToastSuccess("OTP đã được gửi qua email của bạn");
                return otp;
            } else {
                showToastError("Gửi OTP thất bại");
                return null;
            }
        } catch (error) {
            console.log(error);
            showToastError("Gửi OTP thất bại");
            return null;
        }
    };

    return {
        getOTP,
        verifyOTP,
    };
};

export default useOTP;
