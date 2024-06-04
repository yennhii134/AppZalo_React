import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../api/axiosInstance";
import { useAuthContext } from "../contexts/AuthContext";

const useLogout = () => {
  const { setAuthUser, setAccessToken, setRefreshToken } = useAuthContext();
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

  return logout;
};

export default useLogout;
