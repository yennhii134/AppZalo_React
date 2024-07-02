import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    Pressable,
    Image,
    ScrollView,
    StyleSheet,
    Modal,
    TextInput,
    ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { selectFriends } from "../../redux/stateFriendsSlice";
import useGroup from "../../hooks/useGroup";
import { setIsUpdateGroup } from "../../redux/stateUpdateGroupSlice";

const CreateGroup = ({ isOpen, isClose, setGroup }) => {
    // Fet Api
    const { createGroup } = useGroup()
    const friends = useSelector(selectFriends)

    const [modalCreateGr, setModalCreateGr] = useState(false)
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [nameGroup, setNameGroup] = useState('')
    const searchInputRef = useRef(null);
    const [textSearch, setTextSearch] = useState('')
    const [listSearch, setListSearch] = useState([])
    const [isSearch, setIsSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    // Redux
    const dispatch = useDispatch();

    useEffect(() => {
        setModalCreateGr(isOpen)
    }, [isOpen])

    const closeModal = () => {
        setModalCreateGr(false);
        setSelectedFriends([]);
        setNameGroup('');
        setTextSearch('')
        isClose(false)
    }
    const isFriendSelected = (friend) => {
        return selectedFriends.includes(friend);
    };
    const handleFriendSelection = (item) => {
        if (selectedFriends.includes(item)) {
            setSelectedFriends(prevState => prevState.filter(friend => friend.userId !== item.userId));
        } else {
            setSelectedFriends(prevState => [...prevState, item]);
        }
    };
    const renderListItem = (item, index) => (
        <Pressable key={index} style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
            onPress={() => { handleFriendSelection(item) }}>
            <View style={{ width: "85%", flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ padding: 10 }}>
                    <Image
                        source={{ uri: item.profile.avatar.url }}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </View>
                <Text style={{ fontWeight: "500", marginLeft: 0 }}>{item.profile.name}</Text>
            </View>
            <View style={{ padding: 13, width: 24, height: 24, backgroundColor: '#F3F5F6', borderRadius: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#37333A' }}>
                {isFriendSelected(item) && (
                    <View style={{ width: 25, height: 25, backgroundColor: '#0091FF', borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons color='white' size={27} name="checkmark-circle" />
                    </View>
                )}
            </View>
        </Pressable>
    )
    const handleCreate = async () => {
        setIsLoading(true)
        let idUser = [];
        for (const id of selectedFriends) {
            idUser.push(id.userId)
        }
        const response = await createGroup(nameGroup, idUser)
        if (response) {
            setGroup(response.group)
            dispatch(setIsUpdateGroup())
            closeModal()
        }
        setIsLoading(false)
    }
    useEffect(() => {
        if (textSearch.trim() === '') {
            setListSearch([])
        }
        else {
            const filteredFriends = friends.filter((friend) => {
                return friend.profile.name.toLowerCase().includes(textSearch.toLowerCase()) || friend.phone === textSearch;
            });
            if (filteredFriends.length > 0) {
                setListSearch(filteredFriends)
                setIsSearch(true)
            } else {
                setIsSearch(false)
            }
        }
    }, [textSearch])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalCreateGr}
        >
            <Pressable style={styles.modalContainer} onPress={closeModal}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Pressable style={styles.pressClose} onPress={closeModal}>
                            <Ionicons name="close" size={30} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.modalTitle}>Tạo nhóm mới</Text>
                        <Text style={styles.selectedCount}>Đã chọn: {selectedFriends.length}</Text>
                    </View>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={30} color="black" />
                        <TextInput
                            ref={searchInputRef}
                            onChangeText={(text) => setTextSearch(text)}
                            placeholder="Tìm tên hoặc số điện thoại"
                            placeholderTextColor='gray'
                            style={styles.searchInput}
                        />
                        <Pressable onPress={() => {
                            setTextSearch(''); setListSearch([]);
                            if (searchInputRef.current) {
                                searchInputRef.current.clear();
                            }
                        }}>
                            <Ionicons name="close-circle" size={30} color="gray" />
                        </Pressable>
                    </View>
                    <View style={styles.groupNameContainer}>
                        <TextInput
                            value={nameGroup}
                            onChangeText={setNameGroup}
                            placeholder="Vui lòng đặt tên nhóm"
                            placeholderTextColor='gray'
                            style={styles.groupNameInput}
                        />
                    </View>
                    <View style={styles.memberPrompt}>
                        <Text style={styles.memberPromptText}>Chọn ít nhất hai thành viên</Text>
                    </View>
                    <View style={styles.friendListContainer}>
                        <ScrollView>
                            {textSearch.trim() === '' ? (
                                friends?.map(renderListItem)
                            ) : (
                                isSearch && listSearch?.map(renderListItem)
                            )}
                        </ScrollView>
                    </View>
                    {(selectedFriends.length > 1 && nameGroup !== '') && (
                        <View style={styles.createButtonContainer}>
                            <Pressable style={styles.createButton} onPress={handleCreate}>
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Image style={styles.arrowIcon} source={require("../../../assets/arrow.png")} />
                                )}
                            </Pressable>
                        </View>
                    )}
                </View>
            </Pressable>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: '100%',
        height: '90%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    pressClose: {
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontWeight: '600',
        fontSize: 20,
    },
    selectedCount: {
        color: '#979797',
        fontWeight: '600'
    },
    searchContainer: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        width: '100%',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        paddingHorizontal: 10,
    },
    groupNameContainer: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        marginBottom: 10,
    },
    groupNameInput: {
        fontSize: 18,
        height: '100%',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingHorizontal: 10,
    },
    memberPrompt: {
        width: '100%',
        justifyContent: 'center',
        marginBottom: 10,
    },
    memberPromptText: {
        fontSize: 16,
        fontWeight: '600'
    },
    friendListContainer: {
        width: '100%',
        flex: 1,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    friendItem: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    friendInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "75%",
    },
    friendAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    friendName: {
        fontWeight: "500",
        fontSize: 16,
    },
    selectionIconContainer: {
        padding: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkIcon: {
        width: 24,
        height: 24,
        backgroundColor: '#0091FF',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createButtonContainer: {
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginBottom: 20,
    },
    createButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0091FF",
    },
    arrowIcon: {
        width: 50,
        height: 50,
    },
});

export default CreateGroup;

