import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import useFriend from "../../hooks/useFriend";
import { useDispatch } from "react-redux";
import { setIsGroup } from "../../redux/stateCreateGroupSlice";

function FriendRequestComponent({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
            Lời mời kết bạn
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#0091FF",
        shadowColor: "red",
      },
      headerTintColor: "white",
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 20,
      },
    });
  }, [navigation]);

  const { authUser, reloadAuthUser } = useAuthContext();
  const { getFriends, getFriendById, acceptFriend, rejectFriend, cancelFriendRequest, } = useFriend();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendReceived, setFriendReceived] = useState([]);

  useEffect(() => {
    if (authUser.requestSent) {
      const promises = authUser.requestSent.map((id) => getFriendById(id));
      Promise.all(promises).then((friends) => setFriendRequests(friends));
    }
    if (authUser.requestReceived) {
      const promises = authUser.requestReceived.map((id) => getFriendById(id));
      Promise.all(promises).then((friends) => setFriendReceived(friends));
    }
  }, [authUser]);

  const handleAcceptFriend = async (friend) => {
    await acceptFriend(friend.phone);
    dispatch(setIsGroup())
    await reloadAuthUser();
  };

  const handleRejectFriend = async (friend) => {
    await rejectFriend(friend.phone);
    await reloadAuthUser();
  };

  const handleCancelFriendRequest = async (friend) => {
    await cancelFriendRequest(friend.phone);
    await reloadAuthUser();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Lời mời đã nhận ({friendReceived.length})
          </Text>
        </View>
        <View style={styles.cardsContainer}>
          {friendReceived.map((friendReceived) => (
            <View key={friendReceived.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{
                    uri:
                      friendReceived?.profile.avatar?.url ||
                      "https://fptshop.com.vn/Uploads/Originals/2021/6/23/637600835869525914_thumb_750x500.png",
                  }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{friendReceived.profile.name}</Text>
                  <Text style={styles.email}>{friendReceived.email}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.buttonReject}
                  onPress={() => handleRejectFriend(friendReceived)}
                >
                  <Text>Từ chối</Text>
                </Pressable>
                <Pressable
                  style={styles.buttonAccept}
                  onPress={() => handleAcceptFriend(friendReceived)}
                >
                  <Text>Chấp nhận</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Lời mời đã gửi ({friendRequests.length})
          </Text>
        </View>
        <View style={styles.cardsContainer}>
          {friendRequests.map((friendRequest) => (
            <View key={friendRequest.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: friendRequest.profile.avatar.url }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{friendRequest.profile.name}</Text>
                  <Text style={styles.email}>{friendRequest.email}</Text>
                </View>
              </View>
              <Pressable
                style={styles.buttonCancel}
                onPress={() => handleCancelFriendRequest(friendRequest)}
              >
                <Text>Hủy yêu cầu</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
    width: "100%",
    backgroundColor: "white",
    borderBottomWidth: 1,
    zIndex: 20,
  },
  icon: {
    marginHorizontal: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    marginTop: 24,
  },
  section: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    marginBottom: 6,
  },
  card: {
    width: "100%",
    marginVertical: 3,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
  },
  cardContent: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
  },
  email: {
    fontSize: 12,
    color: "gray",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  buttonReject: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonAccept: {
    backgroundColor: "#e5efff",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
});

export default FriendRequestComponent;
