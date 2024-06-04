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


  return { updateProfile };
};

export default useUpdate;
