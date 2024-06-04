import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Message = ({ navigation, route }) => {
  const {user} = route.params

  navigation.setOptions({

    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <Pressable>
          <Ionicons name="call-outline" size={27} color="white" style={{ padding: 5, paddingStart: 15, marginRight: 10 }} />
        </Pressable>
        <Ionicons name="videocam-outline" size={27} color="white" style={{ padding: 5, marginRight: 10 }} />
        <Pressable onPress={() => navigation.navigate('MessageSettings', {user})}>
          <Ionicons name="list-outline" size={27} color="white" style={{ padding: 5 }} />
        </Pressable>

      </View>
    ),
    headerTitle: () => (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{user.ten}</Text>
      </View>
    ),
    headerStyle: {
      backgroundColor: "#0091FF",
      shadowColor: "#fff",
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold",
      fontSize: 20,
    },

  })

  return (
    <View style={{ flex: 1, backgroundColor: '#E5E9EB' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>message</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => console.log('Pressed smiley')}>
          <Ionicons name="happy-outline" size={30} color="black" />
        </TouchableOpacity>

        <TextInput
          style={{ flex: 1, height: 40, borderColor: 'gray', marginLeft: 10, marginRight: 10, borderRadius: 5, paddingLeft: 10 }}
          placeholder="Tin nhắn"
        />

        <TouchableOpacity onPress={() => console.log('Pressed menu')}>
          <Ionicons name="ellipsis-horizontal-outline" size={30} color="black" style={{ marginRight: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Pressed microphone')}>
          <Ionicons name="mic-outline" size={30} color="black" style={{ marginRight: 10 }} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log('Pressed image')}>
          <Ionicons name="image-outline" size={30} color="black" style={{}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Message;
