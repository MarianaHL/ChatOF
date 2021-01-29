import React, {useState, useContext, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {AuthContext} from '../navigation/AuthProvider';

export default function ChatScreen() {
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();
  const [messages, setMessages] = useState([]);

  function handleSend(messages = []) {
    const text = messages[0].text;

    database()
      .ref('chat/')
      .push({
        text,
        uid: user.uid,
        fecha: Date.now(),
      })
      .then((res) => {
        console.log('mensaje guardado');
      })
      .catch((e) => console.log(e));
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(newMessage) => handleSend(newMessage)}
      user={{
        _id: 1,
      }}
    />
  );
}
