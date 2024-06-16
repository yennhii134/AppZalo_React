import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

// AsyncStorage.clear();
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const AuthUser = await AsyncStorage.getItem("authUser");
        const AccessToken = await AsyncStorage.getItem("accessToken");
        const RefreshToken = await AsyncStorage.getItem("refreshToken");
        if (AuthUser) {
          setAuthUser(JSON.parse(AuthUser));
        }
        if (AccessToken) {
          setAccessToken(JSON.parse(AccessToken));
        }
        if (RefreshToken) {
          setRefreshToken(JSON.parse(RefreshToken));
        }
      } catch (error) {
        throw new Error("Error loading data from AsyncStorage:", error);
      }
    };

    loadData();
    reloadAuthUser();
  }, []);
  useEffect(() => {
    const saveData = async () => {
      try {
        if (authUser) {
          await AsyncStorage.setItem("authUser", JSON.stringify(authUser));
        }
        if (accessToken) {
          // console.log("save accessToken", accessToken);
          await AsyncStorage.setItem(
            "accessToken",
            JSON.stringify(accessToken)
          );
        }
        if (refreshToken) {
          await AsyncStorage.setItem(
            "refreshToken",
            JSON.stringify(refreshToken)
          );
        }
      } catch (error) {
        throw new Error("Error saving data to AsyncStorage:", error);
      }
    };

    saveData();
  }, [authUser, accessToken, refreshToken]);
  // Hàm cập nhật avatar mới
  const updateAvatar = async (newAvatarUrl, publicId) => {
    setAuthUser((prevUser) => ({
      ...prevUser,
      profile: {
        ...prevUser.profile,
        avatar: {
          ...prevUser.profile.avatar,
          url: newAvatarUrl,
          public_id: publicId,
        },
      },
    }));
  };
  // Hàm cập nhật bìa mới
  const updateBackground = async (backgroundUrl, publicId) => {
    setAuthUser((prevUser) => ({
      ...prevUser,
      profile: {
        ...prevUser.profile,
        background: {
          ...prevUser.profile.background,
          url: backgroundUrl,
          public_id: publicId,
        },
      },
    }));
  };
  const reloadAuthUser = async () => {
    try {
      const response = await axiosInstance.get("users/get/me");
      if (response.status === 200) {
        setAuthUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.log(error);
      // Toast.error("Failed to get user information");
      return false;
    }
  };
  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        updateAvatar,
        updateBackground,
        reloadAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
