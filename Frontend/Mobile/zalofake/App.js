import Toast from "react-native-toast-message";
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/pages/RootComponent";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { SocketContextProvider } from "./src/contexts/SocketContext";
import store from "./src/redux/store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <NavigationContainer >
      <AuthContextProvider>
        <SocketContextProvider>
          <Provider store={store}>
            <Main  />
          </Provider>
        </SocketContextProvider>
      </AuthContextProvider>
      <Toast />
    </NavigationContainer>
  );
}
