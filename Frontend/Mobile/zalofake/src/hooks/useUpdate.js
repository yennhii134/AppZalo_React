import { useAuthContext } from "../contexts/AuthContext";
import { Alert } from "react-native";
import axiosInstance from "../api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUpdate = () => {
  const { setAuthUser } = useAuthContext();

  const updateProfile = async (name, email, gender, dob) => {
    try {
      const response = await axiosInstance.post("/users/update-profile", {
        name,
        email,
        gender,
        dob,
      });

      const { data, status } = response;

      if (status === 200) {
        const { user } = data;
        if (user) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setAuthUser(user);
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const uploadImageProfile = async (type, selectedImage) => {
    let typeUpload, nameImage, apiUpload
    if (type === "Avatar") {
      typeUpload = "avatar"
      nameImage = "avatar.jpg"
      apiUpload = "upload-avatar"
    } else {
      typeUpload = "background"
      nameImage = "background.jpg"
      apiUpload = "upload-background"
    }
    try {
      const formData = new FormData();
      formData.append(typeUpload, {
        uri: selectedImage,
        type: "image/jpeg",
        name: nameImage,
      });
      const response = await axiosInstance.post(
        `/users/${apiUpload}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const responseJson = response.request._response;
        // // Phân tích chuỗi JSON thành đối tượng JavaScript
        const responseUrl = JSON.parse(responseJson);
        // Lấy URL của avatar từ đối tượng phân tích
        return responseUrl;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }

  }
  return { updateProfile, uploadImageProfile };
};

export default useUpdate;
