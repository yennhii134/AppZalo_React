import { useState } from "react";
import Toast from "react-native-toast-message";
import axiosInstance from "../api/axiosInstance";

const useChangePw = () => {

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
    }
    
    const changePassword = async (oldPassword, newPassword) => {
        try {
            console.log(oldPassword, newPassword)
            const response = await axiosInstance.post("/auth/change-password", {
                oldPassword, newPassword,
            });
            if (response.status === 403) {
                return false;
            }
            else if(response.status === 400){
                return false;
            }
            else if (response.status === 200) {
                return true;
            } else {
                showToastError("Failed to change password")
                return false;
            }

        } catch (error) {
            console.log(error);
            showToastError(error.response.data.message);
            return false;
        }

    };

    return { showToastSuccess, showToastError, changePassword }
}

export default useChangePw;