import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import useToast from "./useToast";

const useRegister = () => {
  const [systemOTP, setSystemOTP] = useState(null);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const { showToastSuccess, showToastError} = useToast()

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

  const getOTP = async (email) => {
    const checkEmai = await check_mail(email);
    if (checkEmai) {
      showToastError("Email đã tồn tại");
      return false;
    } else {
      try {
        setIsOTPVerified(false);
        const otp = await sendOTP(email);
        if (otp) {
          showToastSuccess("OTP đã được gửi qua email của bạn");
          setSystemOTP(otp);
          return true;
        } else {
          showToastError("Gửi OTP thất bại");
          return false;
        }
      } catch (error) {
        console.log(error);
        showToastError("Gửi OTP thất bại");
        return false;
      }
    }
  };

  const verifyEmailAndRegister = async (
    textEmail,
    otp,
    textPhone,
    name,
    dob,
    selectedGender,
    textPW
  ) => {
    const verified = await verifyOTP(otp, systemOTP);
    setIsOTPVerified(verified);
    try {
      if (verified) {
        const response = await axiosInstance.post("/auth/register", {
          phone: textPhone,
          email: textEmail,
          password: textPW,
          name: name,
          dob: dob,
          gender: selectedGender.toString(),
          userOTP: otp,
        });
        setIsOTPVerified(true);
        const data = response.data;
        console.log(data);

        if (response.status === 201) {
          showToastSuccess("Tạo tài khoản thành công");
          return true;
        } else {
          showToastError(data.response.message);
          return false;
        }
      } else {
        showToastError("Mã OTP không khớp");
        return false;
      }
    } catch (error) {
      console.log(error);
      setIsOTPVerified(true);
      showToastError(error.response.data.message);
      return false;
    }
  };

  const check_mail = async (email) => {
    try {
      const response = await axiosInstance.post("/users/check-email", {
        email,
      });
      if (response.status === 404) {
        return false;
      } else if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  const GetSystemOTP = () => {
    return systemOTP;
  };

  const checkMail = async (email) => {
    const checkEmai = await check_mail(email);
    if (checkEmai) {
      // showToastError("Email đã tồn tại");
      return false;
    } else {
      return true;
    }
  };

  return {
    isOTPVerified,
    getOTP,
    verifyEmailAndRegister,
    verifyOTP,
    GetSystemOTP,
    checkMail
  };
};

export default useRegister;
