import { Image, Pressable, Text } from 'react-native';

const CustomToast = {
    tomatoToast: ({ props }) => (
        <Pressable
            onPress={() => { props.navigation.navigate(props.screen) }}
            style={{ height: 60, width: '80%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: 'white' }}>
            <Image source={{ uri: props.avatar }}
                style={{ width: 40, height: 40, borderRadius: 50 }}></Image>
            <Text style={{ width: '80%' }}> <Text style={{ fontWeight: 'bold' }}>{props.name}</Text>{props.text}</Text>
        </Pressable >
    )
};

export default CustomToast;