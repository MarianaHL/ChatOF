import React, {useState, useContext, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  SystemMessage,
} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import {AuthContext} from '../navigation/AuthProvider';
import {IconButton} from 'react-native-paper';
import {StyleSheet, View, ActivityIndicator} from 'react-native';

export default function ChatScreen({ route, navigation }) {
  const { keyExtractor } = route.params;
  console.warn(keyExtractor.uid);
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();

  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState("");


  function handleSend(messages) {
    const text = messages[0].text;

    database()
      .ref('chat/'+channel)
      .push({
        _id: Math.round(Math.random() * 1000000),
        text,
        createdAt: new Date().getTime(),
        userSend: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
        userReceived: {
          _id: keyExtractor.uid,
          email: keyExtractor.email,
        },
      })
      .then((res) => {
        console.log('mensaje guardado');
      })
      .catch((e) => console.log(e));
  }

  useEffect(() => {
    //2 Obtener en el canal de ambos users
    const messagesListener = database()
      .ref('chat/')
      .orderByKey()
      .on('child_added', (snapshot) => {
        //console.log('User data: ', snapshot.val());
        
        console.log(channel)
        /*
        if(snapshot.key === channel){
          const messages = (prevState) => [...prevState, snapshot.val()];
          setMessages(messages);
          console.log("true");
        }*/
        const messages = (prevState) => [...prevState, snapshot.val()];
        setMessages(messages);
        
      });
    return () => messagesListener();
  }, []);

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee',
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
    if(currentUser.uid < keyExtractor.uid){
      setChannel(currentUser.uid + keyExtractor.uid);
      console.log(channel+" CHAAANEEEEEEEEEEEEL")
      console.log(currentUser.uid)
      console.log(keyExtractor.uid)
    }else{
      setChannel(keyExtractor.uid + currentUser.uid);
      console.log(channel+" CHAAANEEEEEEEEEEEEL")
      console.log(currentUser.uid)
      console.log(keyExtractor.uid)
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

  return (
    <GiftedChat
      messages={messages}
      inverted={false}
      onSend={handleSend}
      user={{_id: currentUser.uid}}
      placeholder="Type your message here..."
      alwaysShowSend
      showUserAvatar
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
