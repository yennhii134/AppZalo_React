import Toast from 'react-native-toast-message';
import { NavigationContainer } from "@react-navigation/native";
import Main from "./src/pages/RootComponent";
import { AuthContextProvider } from "./src/contexts/AuthContext";
import { SocketContextProvider } from "./src/contexts/SocketContext";
import store from "./src/redux/store";
import { Provider } from "react-redux";
import CustomToast from './src/components/ModalComponents/CustomToast';
import ReduxContextProvider from './src/contexts/ReduxContext';

export default function App() {
  return (
    <NavigationContainer >
      <Provider store={store}>
        <AuthContextProvider>
          <SocketContextProvider>
            <ReduxContextProvider>
              <Main />
            </ReduxContextProvider>
          </SocketContextProvider>
        </AuthContextProvider>
      </Provider>
      <Toast config={CustomToast} />
    </NavigationContainer>
  );
}
