import { ActivityIndicator, Image, Modal, Pressable, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import useUpdate from "../../../hooks/useUpdate";
import { useAuthContext } from "../../../contexts/AuthContext";
import { useEffect, useState } from "react";

const ModalUpdateImageProfile = ({ onOpen, type, isUpdate, onClose, renderImage }) => {
    const { authUser, updateAvatar, updateBackground } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const { uploadImageProfile } = useUpdate();

    useEffect(() => {
        if (onOpen) {
            if (type === "Avatar") {
                setSelectedImage(authUser?.profile?.avatar?.url);
            } else {
                setSelectedImage(authUser?.profile?.background?.url);
            }
            setModalVisible(true);
        }
    }, [onOpen])

    const openImagePicker = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            console.log("Permission to access camera roll is required!");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!pickerResult.canceled) {
            setSelectedImage(pickerResult.assets[0].uri);
        } else {
            console.log("No image selected");
        }
    };
    const handleUpdate = async () => {
        if (isUpdate) {
            setIsLoading(true)
            const response = await uploadImageProfile(type, selectedImage)
            if (response) {
                if (type === "Avatar") {
                    setSelectedImage(response.avatar.url)
                    updateAvatar(response.avatar.url, response.avatar.public_id)
                } else {
                    setSelectedImage(response.background.url)
                    updateBackground(response.background.url, response.background.public_id)
                }
                console.log("Success", "Updated successfully");
            }
            else {
                console.log("Failed to update");
            }
            setIsLoading(false)
        }
        setModalVisible(false);
        onClose(false)
        renderImage(selectedImage)
    };
    const closeModal = () => {
        setModalVisible(false)
        onClose(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)", }}
                onPress={closeModal}>
                <View
                    style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <View style={{ alignItems: 'center', paddingBottom: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', fontFamily: 'Courier', color: 'gray' }}>Cập nhật ảnh {type === 'Avatar' ? 'avatar' : 'bìa'} </Text>
                    </View>
                    <Pressable onPress={openImagePicker}>
                        <Image
                            source={{ uri: selectedImage }}
                            style={{ width: 200, height: 200, borderRadius: 100 }} />
                    </Pressable>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
                        <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={closeModal}>
                            <Text style={{ color: "white", fontWeight: 'bold' }}>
                                Đóng
                            </Text>
                        </Pressable>
                        <Pressable style={{ backgroundColor: '#0091FF', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, width: 85 }} onPress={handleUpdate}>
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={{ color: "white", fontWeight: 'bold' }}>
                                    Cập nhật
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}

export default ModalUpdateImageProfile;