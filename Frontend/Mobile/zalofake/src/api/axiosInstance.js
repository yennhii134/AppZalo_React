import axios from "axios";
import config from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const axiosInstance = axios.create({
  baseURL: config.baseURL,
});
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      config.headers["User-Agent"] += "Mobile";

      if (!config.url.includes("/auth/login")) {
        const accessToken = JSON.parse(
          await AsyncStorage.getItem("accessToken")
        );
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest.url.includes("auth/login")
    ) {
      try {
        const refreshToken = JSON.parse(
          await AsyncStorage.getItem("refreshToken")
        );

        const refreshedTokenResponse = await axiosInstance.post(
          "/auth/refreshToken",
          {
            refreshToken,
          }
        );
        const newAccessToken = refreshedTokenResponse.data.newAccessToken;
        if (!newAccessToken) {
          showErrorToast("Your session has expired. Please login again.");
          await AsyncStorage.clear();
          return Promise.reject(error);
        } else {
          await AsyncStorage.setItem(
            "accessToken",
            JSON.stringify(newAccessToken)
          );
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // console.error("Refresh token failed:", refreshError);
        showErrorToast("Your session has expired. Please login again.");
        await AsyncStorage.clear();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const showErrorToast = (message) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message,
    position: "bottom",
    visibilityTime: 4000,
    autoHide: true,
  });
};

export default axiosInstance;
