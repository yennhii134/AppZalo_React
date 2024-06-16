import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import * as Device from "expo-device";

import axiosInstance from "../api/axiosInstance";
import useToast from "./useToast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuth = () => {
  const [loginCount, setLoginCount] = useState(1);
  const { setAuthUser, setAccessToken, setRefreshToken } = useAuthContext();
  const { showToastError, showToastSuccess } = useToast()

  const login = async (phone, password) => {
    try {
      const device_id = Device.osBuildId;
      const response = await axiosInstance.post("/auth/login", {
        phone,
        password,
        device_id,
      });

      const data = response.data;

      if (response && response?.status === 200) {
        setAuthUser(data.user);
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      } else {
        showToastError("Error during login");
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.log(loginCount);
        setLoginCount(loginCount + 1);
        if (loginCount === 5) {
          setLoginCount(1);
        }
        showToastError("Sai tài khoản hoặc mật khẩu");
      } else if (error.request) {
        showToastError("Error server, please try again !");
        throw error;
      } else {
        showToastError("Error during login");
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      const refreshToken = JSON.parse(
        await AsyncStorage.getItem("refreshToken")
      );
      if (refreshToken != null) {
        const response = await axiosInstance.post("/auth/logout", {
          refreshToken: refreshToken,
        });
        if (response.status === 200) {
          await AsyncStorage.clear();
          setAuthUser(null);
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyEmailAndRegister = async (
    textEmail,
    textPhone,
    name,
    dob,
    selectedGender,
    textPW,
  ) => {
    try {
      const response = await axiosInstance.post("/auth/register", {
        phone: textPhone,
        email: textEmail,
        password: textPW,
        name: name,
        dob: dob,
        gender: selectedGender.toString(),
      });
      const data = response.data;
      if (response.status === 201) {
        showToastSuccess("Tạo tài khoản thành công");
        return true;
      } else {
        showToastError(data.response.message);
        return false;
      }
    } catch (error) {
      console.log("error1", error);
      showToastError(error.response.data.message);
      return false;
    }
  };

  const checkPhone = async (phone) => {
    try {
      const response = await axiosInstance.post("/users/check-phone", {
        phone,
      });
      if (response.status === 404) {
        return true;
      } else if (response.status === 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  };
  const checkMail = async (email) => {
    try {
      const response = await axiosInstance.post("/users/check-email", {
        email,
      });
      if (response.status === 404) {
        return true;
      } else if (response.status === 200) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
  };

  return { login, loginCount, logout, verifyEmailAndRegister, checkPhone, checkMail };
};

export default useAuth;
