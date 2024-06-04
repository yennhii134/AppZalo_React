import Toast from 'react-native-toast-message'

const useToast = () => {
    const showToastSuccess = (notice) => {
        Toast.show({
            text1: notice,
            type: "success",
            topOffset: 0,
            position: "bottom",
        });
    };
    const showToastError = (notice) => {
        Toast.show({
            text1: notice,
            type: "error",
            topOffset: 0,
            position: "bottom",
        });
    };
    return {
        showToastError,
        showToastSuccess
    }
}
export default useToast;