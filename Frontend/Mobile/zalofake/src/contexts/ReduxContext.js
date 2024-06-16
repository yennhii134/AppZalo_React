import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFriends } from '../redux/stateFriendsSlice';
import { useAuthContext } from './AuthContext';
import { fetchGroups } from '../redux/stateGroupsSlice';

const ReduxContextProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { authUser } = useAuthContext();

    useEffect(() => {
        const loadDatas = async () => {
            if (authUser) {
                try {
                    await dispatch(fetchFriends());
                    await dispatch(fetchGroups());
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        loadDatas();
    }, [authUser, dispatch]);

    return children;
};

export default ReduxContextProvider;
