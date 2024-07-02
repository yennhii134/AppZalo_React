import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useAuthContext } from "../../contexts/AuthContext";
import useFriend from "../../hooks/useFriend";

function FriendRequestComponent({ navigation }) {
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

  const { authUser } = useAuthContext();
  const { getFriendById, acceptFriend, rejectFriend, cancelFriendRequest, } = useFriend();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendReceived, setFriendReceived] = useState([]);
  const [loadingStates, setLoadingStates] = useState([]);
  const states = { ACCEPT: 'ACCEPT', REJECT: 'REJECT', CANCEL: 'CANCEL' };

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

  const setLoading = (userId, state) => {
    setLoadingStates((prevState) => [
      ...prevState, {
        userId,
        state,
      }
    ]);
  };

  const unSetLoading = (userId) => {
    setLoadingStates((prevState) =>
      prevState.filter(item => item.userId !== userId)
    )
  }
  const isLoading = (userId, state) => {
    return loadingStates.some(item => item.userId === userId && item.state === state)
  }
  const handleAcceptFriend = async (friend) => {
    setLoading(friend.userId, states.ACCEPT);
    await acceptFriend(friend.userId);
    unSetLoading(friend.userId)

  };

  const handleRejectFriend = async (friend) => {
    setLoading(friend.userId, states.REJECT);
    await rejectFriend(friend.userId);
    unSetLoading(friend.userId)
  };

  const handleCancelFriendRequest = async (friend) => {
    setLoading(friend.userId, states.CANCEL);
    await cancelFriendRequest(friend.userId);
    unSetLoading(friend.userId)
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
            <View key={friendReceived.userId} style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{ uri: friendReceived.profile.avatar.url }}
                  style={styles.avatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.name}>{friendReceived.profile.name}</Text>
                  <Text style={styles.phone}>{friendReceived.phone}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.buttonReject}
                  onPress={() => handleRejectFriend(friendReceived)}
                >
                  {isLoading(friendReceived.userId, states.REJECT)
                    ? <ActivityIndicator color='black' size='small' />
                    : <Text style={{ fontWeight: 'bold' }}>Từ chối</Text>
                  }
                </Pressable>
                <Pressable
                  style={styles.buttonAccept}
                  onPress={() => handleAcceptFriend(friendReceived)}
                >
                  {isLoading(friendReceived.userId, states.ACCEPT)
                    ? <ActivityIndicator color='black' size='small' />
                    : <Text style={{ fontWeight: 'bold' }}>Chấp nhận</Text>
                  }
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
            <View key={friendRequest.userId} style={styles.card}>
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
                {isLoading(friendReceived.userId, states.CANCEL)
                  ? <ActivityIndicator color='black' size='small' />
                  : <Text style={{ fontWeight: 'bold' }}>Hủy yêu cầu</Text>
                }
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
  phone: {
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
