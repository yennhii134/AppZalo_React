import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SocketContextProvider } from "../contexts/SocketContext";
import { useNavigation } from "@react-navigation/native";
import RegisterName from "../components/LoginComponents/RegisterName";
import RegisterInfo from "../components/LoginComponents/RegisterInfo";
import Login from "../components/LoginComponents/Login";
import { useAuthContext } from "../contexts/AuthContext";

import SearchFriends from "../components/ChatComponents/SearchFriends/SearchFriends";
import Message from "../components/ChatComponents/Message/Message";
import FriendProfileSettings from "../components/ChatComponents/FriendProfile/FriendProfileSettings";
import MessageSettings from "../components/ChatComponents/Message/MessageSettings";
import FriendProfile from "../components/ChatComponents/FriendProfile/FriendProfile";
import AddFriends from "../components/ChatComponents/AddFriends";
import LoginMain from "../components/LoginComponents/LoginMain";
import MainComponent from "../pages/MainComponent";
import Chat from "../components/ChatComponents/Chat/Chat";
import Info from "../components/InfoComponents/Info";
import PersonalPage from "../components/InfoComponents/PersonalPageComponents/PersonalPage";
import PersonalDetail from "../components/InfoComponents/PersonalPageComponents/PersonalDetail";
import PersonalInfo from "../components/InfoComponents/PersonalPageComponents/PersoncalInfo";
import PersonalPrivacy from "../components/InfoComponents/PersonalPrivacy";
import AccountVsSecurity from "../components/InfoComponents/AccoutVsSecurity";
import PersonalSetting from "../components/InfoComponents/PersonalSetting";
import ChangePassword from "../components/InfoComponents/ChangePassword";
import FriendRequest from "../components/ChatComponents/FriendRequest";

const Stack = createNativeStackNavigator();

export default function RootComponent() {
  const { authUser } = useAuthContext();
  const navigation = useNavigation();

  return authUser ? (
    <SocketContextProvider navigation={navigation}>
      <Stack.Navigator initialRouteName="ChatComponent">
        <Stack.Screen
          name="ChatComponent"
          component={MainComponent}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="SearchFriends" component={SearchFriends} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="FriendProfileSettings" component={FriendProfileSettings} />
        <Stack.Screen name="MessageSettings" component={MessageSettings} />
        <Stack.Screen name="FriendProfile" component={FriendProfile} />
        <Stack.Screen name="AddFriends" component={AddFriends} />
        <Stack.Screen name="FriendRequest" component={FriendRequest} />

        <Stack.Screen name="ChatContent" component={Chat} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="PersonalPage" component={PersonalPage} />
        <Stack.Screen name="PersonalDetail" component={PersonalDetail} />
        <Stack.Screen name="PersonalPrivacy" component={PersonalPrivacy} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
        <Stack.Screen name="AccountVsSecurity" component={AccountVsSecurity} />
        <Stack.Screen name="PersonalSetting" component={PersonalSetting} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Navigator>
    </SocketContextProvider>

  ) : (
    <Stack.Navigator initialRouteName="LoginMain">
      <Stack.Screen
        name="LoginMain"
        component={LoginMain}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RegisterName"
        component={RegisterName}
        options={{
          headerStyle: {
            backgroundColor: "#0091FF",
          },
          headerTintColor: "#fff",
          title: "Tạo tài khoản",
        }}
      />
      <Stack.Screen
        name="RegisterInfo"
        component={RegisterInfo}
        options={{
          headerStyle: {
            backgroundColor: "#0091FF",
          },
          headerTintColor: "#fff",
          title: "Tạo tài khoản",
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerStyle: {
            backgroundColor: "#0091FF",
          },
          headerTintColor: "#fff",
          title: "Đăng nhập",
        }}
      />
    </Stack.Navigator>
  );
}
