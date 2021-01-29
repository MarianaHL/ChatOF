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

    useEffect(() => {
      const messagesListener = database()
        .ref('chat/')
        .orderBy('fecha')
        .on('child_added', (snapshot) => {
          console.log('User data: ', snapshot.val());
          setMessages(snapshot.val);
        });
      /* 
        .on((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => {
            const firebaseData = doc.data();

            const data = {
              _id: doc.id,
              text: '',
              createdAt: new Date().getTime(),
              ...firebaseData,
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
                name: firebaseData.user.email,
              };
            }

            return data;
          });

          setMessages(messages);
        }); */

      return () => messagesListener();
    }, []);
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
