import React, {useState, useContext, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
  Avatar,
} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {AuthContext} from '../navigation/AuthProvider';
import {IconButton} from 'react-native-paper';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

export default function ChatScreen({route, navigation}) {
  const {keyExtractor} = route.params;
  console.warn(keyExtractor.uid);
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState();

  function handleSend(messages) {
    const text = messages[0].text;
    database()
      .ref(`chat/${channel}`)
      .push({
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date().getTime(),
        userSend: {
          _id: currentUser.uid,
          email: currentUser.email
        },
        userRecived: {
          _id: keyExtractor.uid,
          email: keyExtractor.email
        }
      })
      .then((res) => {
        console.log('mensaje guardado');
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    //2 Obtener en el canal de ambos users
    const messagesListener = database()
      .ref(`chat/${channel}`)
      .orderByChild('createdAt')
      .on('child_added', (snapshot) => {
        const messages = (prevState) => [...prevState, snapshot.val()];
        setMessages(messages);
      });
    //return () => messagesListener();
  }, [channel]);

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6646ee',
          },
          left: {
            backgroundColor: '#e0e0e0',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  function renderLoading() {
    //1 Comprobar si existe el canal en caso contrario crearlo
    if (currentUser.uid < keyExtractor.uid) {
      setChannel(currentUser.uid + keyExtractor.uid);
      console.log(channel + ' CHAAANEEEEEEEEEEEEL');
      console.log(currentUser.uid);
      console.log(keyExtractor.uid);
    } else {
      setChannel(keyExtractor.uid + currentUser.uid);
      console.log(channel + ' CHAAANEEEEEEEEEEEEL');
      console.log(currentUser.uid);
      console.log(keyExtractor.uid);
    }
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon="send-circle" size={32} color="#6646ee" />
        </View>
      </Send>
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon="chevron-double-down" size={36} color="#6646ee" />
      </View>
    );
  }

  function renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        wrapperStyle={styles.systemMessageWrapper}
        textStyle={styles.systemMessageText}
      />
    );
  }

  const renderAvatar = (props) => (
    <Avatar
      {...props}
      imageStyle={{
        left: {borderWidth: 3, borderColor: 'blue'},
        right: {},
      }}
    />
  );

  function mapUser(user) {
    return {
      _id: currentUser.uid,
      name: currentUser.email,
      avatar: currentUser.foto,
    };
  }

  return (
    <GiftedChat
      messages={messages}
      inverted={false}
      onSend={handleSend}
      user={mapUser(user)}
      placeholder="Type your message here..."
      showUserAvatar
      //renderAvatar={renderAvatar}
      alwaysShowSend
      scrollToBottom
      renderBubble={renderBubble}
      renderLoading={renderLoading}
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderSystemMessage={renderSystemMessage}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});
