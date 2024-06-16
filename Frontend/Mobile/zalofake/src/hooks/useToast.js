import Toast from 'react-native-toast-message'

const useToast = () => {
    const showToastSuccess = (notice) => {
        Toast.show({
            text1: notice,
            type: "success",
            top: 30,
            position: "relative",
        });
    };
    const showToastError = (notice) => {
        Toast.show({
            text1: notice,
            type: "error",
            top: 30,
            position: "relative",
        });
    };
    const showToastFriendRequest = (avatar, name, text, navigation, screen) => {
        Toast.show({
            type: 'tomatoToast',
            props: { avatar, name, text, navigation, screen },
            top: 30,
            position: "relative",
        });
    };
    return {
        showToastError,
        showToastSuccess,
        showToastFriendRequest
    }
}
export default useToast;