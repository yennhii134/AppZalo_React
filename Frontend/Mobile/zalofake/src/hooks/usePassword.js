import axiosInstance from "../api/axiosInstance";

const usePassword = () => {
    const check_mail = async (email) => {
        try {
            const response = await axiosInstance.post("/users/check-email", {
                email,
            });
            if (response.status === 200) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    const changePassword = async (oldPassword, newPassword) => {
        try {
            const response = await axiosInstance.post("/auth/change-password", {
                oldPassword, newPassword,
            });
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };
    const resetPassword = async (email, newPassword) => {
        try {
            const response = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
            });

            if (response.status === 200) {
                console.log("Change Password Successfully");
                return true;
            } else {
                console.log("Failed to reset password")
                return false;
            }

        } catch (error) {
            console.log(error);
            return false;
        }
    }

    return { changePassword, check_mail, resetPassword }
}

export default usePassword;